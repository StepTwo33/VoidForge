import type { Ability, Warframe } from "@/lib/types";

/**
 * Sevagoth's Shadow / Sevagoth Prime's Shadow: the exalted form summoned by Exalted Shadow.
 *
 * In game the Shadow is its own moddable frame (wiki Sevagoth/Abilities/Passive: "separate
 * Upgrade loadouts ... a different Aura, Arcane Enhancements, and Mods", a pre-installed
 * Orokin Reactor, Forma / Exilus Adapter, abilities that Helminth can't replace, and Archon
 * Shards from Sevagoth apply). Its abilities scale with the Shadow's own mods.
 *
 * Stats: wiki Module:Warframes/data "Sevagoth's Shadow" / "Sevagoth Prime's Shadow" (both
 * 270 HP, 135 shields (185 at rank 30), 475 armor, 100 energy, 1.1 sprint, 50 starting energy).
 * Abilities: wiki Embrace, Consume, Death's Harvest and Reunite pages, rank 3 values.
 */
export const SEVAGOTH_SHADOW_BASE_STATS: Pick<Warframe, "health" | "shield" | "armor" | "energy" | "sprintSpeed"> = {
  health: 270,
  shield: 135,
  armor: 475,
  energy: 100,
  sprintSpeed: 1.1,
};

export const SEVAGOTH_SHADOW_ABILITIES: Ability[] = [
  {
    name: "Embrace",
    energyCost: 25,
    description:
      "Ghostly hands pull enemies into a flailing mass. Enemies in an 80° cone are ragdolled and pulled together at the cast location.",
    range: 20,
    duration: 8,
    castTime: 1,
    miscStats: { pullAngle: 80 },
  },
  {
    name: "Consume",
    energyCost: 25,
    description:
      "Dash through enemies and rip out their souls to heal Shadow. A targeted enemy takes Radiation damage and is knocked down; the Shadow heals a share of that damage. With no target, the Shadow dashes 30 m.",
    damage: 2500,
    range: 14,
    damageType: "Radiation",
    miscStats: { healthHealPercent: 0.25, untargetedDashRange: 30 },
  },
  {
    name: "Death's Harvest",
    energyCost: 75,
    description:
      "Inflict nearby enemies with a harrowing condition: a wail that makes every enemy in range take more damage. Kills on debuffed enemies fill the Death Well.",
    radius: 12,
    duration: 10,
    miscStats: { damageVulnerability: 0.5, deathWellGain: 0.05 },
  },
  {
    name: "Reunite",
    energyCost: 0,
    description:
      "Sevagoth and his Shadow become one. Each 1% of the Death Well drained while the Shadow was out heals Sevagoth for 1% of his max health.",
    miscStats: { deathWellDrainHeal: 0.01 },
  },
];
