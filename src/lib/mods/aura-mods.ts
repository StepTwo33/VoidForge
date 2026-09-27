import { Mod } from "@/lib/types";
import { modCapacityAtRank } from "@/lib/calc/mod-capacity";

export { modCapacityAtRank };

/** Aura-slot mod IDs (negative drain auras + matching-polarity bonus mods). */
export const AURA_MOD_IDS = new Set([
  "aerodynamic",
  "aura_corrosive_projection",
  "aura_energy_siphon",
  "aura_enemy_radar",
  "aura_infested_impedance",
  "aura_looters",
  "aura_physique",
  "aura_pistol_amplification",
  "aura_rejuvenation",
  "aura_rifle_amplification",
  "aura_shield_disruption",
  "aura_shotgun_amplification",
  "aura_speed_holster",
  "aura_sprint_boost",
  "aura_sprint_speed",
  "aura_steel_charge",
  "aura_toxin_resistance",
  "brief_respite",
  "combat_discipline",
  "dead_eye",
  "dreamers_bond",
  "emp_aura",
  "empowered_blades",
  "growing_power",
  "holster_amp",
  "loot_detector",
  "melee_guidance",
  "pistol_scavenger",
  "power_donation_r5",
  "ready_steel",
  "rifle_scavenger",
  "shepherd",
  "shotgun_scavenger",
  "sniper_scavenger",
  "stand_united",
  "summoners_wrath",
  "swift_momentum",
  "worthy_comradery",
  "mecha_empowered",
]);

export function isAuraMod(mod: Mod): boolean {
  return AURA_MOD_IDS.has(mod.id);
}

/** Max rank capacity cost shown in codex / mod browser. */
export function modMaxCapacity(mod: Pick<Mod, "drain" | "maxRank">): number {
  return modCapacityAtRank(mod.drain, mod.maxRank);
}
