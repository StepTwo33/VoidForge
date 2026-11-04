/**
 * Arcane Intention eligible channeled abilities.
 * Source: wiki.warframe.com/w/Arcane_Intention, "Eligible Abilities" table (fetched 2026-11-03).
 * `requiresMod` / `excludedByMod`: augment gates from the table notes (mod names).
 */
export interface IntentionEligibleAbility {
  warframe: string;
  ability: string;
  requiresMod?: string;
  excludedByMod?: string;
  note?: string;
}

export const ARCANE_INTENTION_ELIGIBLE: IntentionEligibleAbility[] = [
  { warframe: "Atlas", ability: "Tectonics", excludedByMod: "Tectonic Fracture", note: "Does not qualify if Tectonic Fracture is used." },
  { warframe: "Atlas", ability: "Rumblers" },
  { warframe: "Banshee", ability: "Sound Quake", requiresMod: "Gaseous Quake", note: "Only qualifies if Gaseous Quake is used." },
  { warframe: "Baruuk", ability: "Elude" },
  { warframe: "Baruuk", ability: "Serene Storm" },
  { warframe: "Chroma", ability: "Spectral Scream" },
  { warframe: "Chroma", ability: "Effigy" },
  { warframe: "Cyte-09", ability: "Neutralize" },
  { warframe: "Dante", ability: "Noctua" },
  { warframe: "Ember", ability: "Immolation" },
  { warframe: "Equinox", ability: "Pacify & Provoke" },
  { warframe: "Equinox", ability: "Mend & Maim" },
  { warframe: "Excalibur", ability: "Exalted Blade" },
  { warframe: "Gara", ability: "Mass Vitrify", note: "Only qualifies during the glass wall expansion." },
  { warframe: "Gauss", ability: "Mach Rush" },
  { warframe: "Gauss", ability: "Kinetic Plating" },
  { warframe: "Gauss", ability: "Redline" },
  { warframe: "Grendel", ability: "Pulverize" },
  { warframe: "Gyre", ability: "Arcsphere", note: "Only qualifies while the gyratory sphere is in motion, not once it is deployed." },
  { warframe: "Gyre", ability: "Coil Horizon", note: "Only qualifies while the gyratory sphere is in motion, not once it is deployed." },
  { warframe: "Hildryn", ability: "Balefire" },
  { warframe: "Hildryn", ability: "Pillage", note: "Only qualifies during the initial expansion" },
  { warframe: "Hildryn", ability: "Haven" },
  { warframe: "Hildryn", ability: "Aegis Storm" },
  { warframe: "Inaros", ability: "Sandstorm" },
  { warframe: "Inaros", ability: "Scarab Shell" },
  { warframe: "Ivara", ability: "Quiver", note: "Only qualifies while its arrows are in flight. Using Artemis Bow's alt-fire to loose Quiver's arrows does not qualify." },
  { warframe: "Ivara", ability: "Navigator", note: "Only qualifies while actively controlling a projectile." },
  { warframe: "Ivara", ability: "Prowl", note: "Briefly becoming visible while Prowl is active does not disqualify it." },
  { warframe: "Ivara", ability: "Artemis Bow" },
  { warframe: "Jade", ability: "Glory on High" },
  { warframe: "Lavos", ability: "Vial Rush" },
  { warframe: "Limbo", ability: "Stasis" },
  { warframe: "Limbo", ability: "Cataclysm" },
  { warframe: "Mag", ability: "Magnetize", note: "Only the protective hold-cast version qualifies" },
  { warframe: "Mesa", ability: "Ballistic Battery" },
  { warframe: "Mesa", ability: "Peacemaker" },
  { warframe: "Mirage", ability: "Prism" },
  { warframe: "Narin", ability: "Hakchum", note: "Only qualifies while airborne." },
  { warframe: "Narin", ability: "Nurinarim" },
  { warframe: "Nekros", ability: "Desecrate" },
  { warframe: "Nezha", ability: "Divine Spears" },
  { warframe: "Nyx", ability: "Mind Control" },
  { warframe: "Nyx", ability: "Absorb" },
  { warframe: "Oberon", ability: "Hallowed Ground", requiresMod: "Hallowed Eruption", note: "Only qualifies when Hallowed Eruption is used." },
  { warframe: "Oberon", ability: "Renewal" },
  { warframe: "Oraxia", ability: "Silken Stride" },
  { warframe: "Qorvex", ability: "Crucible Blast", note: "Only qualifies during the casting animation." },
  { warframe: "Revenant", ability: "Reave" },
  { warframe: "Revenant", ability: "Danse Macabre" },
  { warframe: "Rhino", ability: "Iron Skin", requiresMod: "Iron Shrapnel", note: "Only qualifies when Iron Shrapnel is used." },
  { warframe: "Sevagoth", ability: "Gloom" },
  { warframe: "Sirius & Orion", ability: "Celestial Clash" },
  { warframe: "Temple", ability: "Exalted Solo" },
  { warframe: "Titania", ability: "Razorwing" },
  { warframe: "Valkyr", ability: "Hysteria" },
  { warframe: "Wisp", ability: "Wil-O-Wisp", note: "Only qualifies when tap-cast." },
  { warframe: "Wisp", ability: "Sol Gate" },
  { warframe: "Wukong", ability: "Cloud Walker" },
  { warframe: "Wukong", ability: "Defy" },
  { warframe: "Wukong", ability: "Primal Fury" },
  { warframe: "Yareli", ability: "Merulina" },
  { warframe: "Yareli", ability: "Riptide", note: "Only qualifies when tap-cast." },
  { warframe: "Helminth", ability: "Parasitic Armor" },
];

/** wiki Notes: "up to a maximum of 4 stacks". */
export const ARCANE_INTENTION_MAX_STACKS = 4;
