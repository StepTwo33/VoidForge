import { Mod } from "@/lib/types";

/** Arch-melee-only mods (separate pool from ground melee; no stances). */
export const ARCHMELEE_MOD_IDS = new Set([
  "astral_autopsy",
  "astral_cut",
  "astral_slash",
  "blazing_steel",
  "bleeding_edge",
  "conductive_blade",
  "critical_meltdown",
  "cryo_coating",
  "cutting_edge",
  "extend",
  "furor",
  "glacial_edge",
  "infectious_injection",
  "ion_infusion",
  "magnetized_core",
  "meteor_crash",
  "nebula_bore",
  "poisonous_sting",
  "searing_steel",
  "sudden_impact",
  "tempered_blade",
]);

export function isArchmeleeMod(mod: Mod | { id: string; category?: string }): boolean {
  return mod.category === "archmelee" || ARCHMELEE_MOD_IDS.has(mod.id);
}

export function filterArchmeleeMods(mods: Mod[]): Mod[] {
  return mods.filter(isArchmeleeMod);
}
