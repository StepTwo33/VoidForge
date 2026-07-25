/**
 * Which companions can equip each penjaga precept in the builder.
 * Codex lists all precepts regardless — only the builder filters by this map.
 *
 * Regenerate: python scripts/generate_companion_precept_eligibility.py
 */

import type { Companion, Mod } from "@/lib/types";
import {
  isCompanionPrecept,
} from "@/lib/mods/companion-augment-mods";

/** Companion ids that may equip each precept mod in the builder. */
export const COMPANION_PRECEPT_COMPANION_IDS: Readonly<Record<string, readonly string[]>> = {
  "acidic_spittle": ["medjay_predasite", "pharaoh_predasite", "vizier_predasite"],
  "aerial_prospectus": ["bhaira_hound", "dorma_hound", "hec_hound"],
  "ammo_case": ["carrier", "carrier_prime"],
  "anabolic_pollination": ["medjay_predasite", "pharaoh_predasite", "vizier_predasite"],
  "anti_grav_array": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "anti_grav_grenade": ["lambeo", "nidus_moa", "olaro", "para"],
  "arc_coil": ["diriga"],
  "auto_omni": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "blast_shield": ["lambeo", "nidus_moa", "olaro", "para"],
  "botanist": ["oxylus"],
  "calculated_shot": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "cats_eye": ["adarza", "smeeta", "vasca"],
  "charm": ["adarza", "smeeta", "vasca"],
  "coolant_leak": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "cordon": ["nautilus", "nautilus_prime"],
  "crescent_charge": ["crescent_vulpaphyla", "panzer_vulpaphyla", "sly_vulpaphyla"],
  "crescent_devolution": ["crescent_vulpaphyla", "panzer_vulpaphyla", "sly_vulpaphyla"],
  "crowd_dispersion": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "detect_vulnerability": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "dig": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "diversified_denial": ["bhaira_hound", "dorma_hound", "hec_hound"],
  "draining_bite": ["adarza", "smeeta", "vasca"],
  "electro_pulse": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "endoparasitic_vector": ["medjay_predasite", "pharaoh_predasite", "vizier_predasite"],
  "energy_generator": ["dethcube", "dethcube_prime"],
  "equilibrium_audit": ["bhaira_hound", "dorma_hound", "hec_hound"],
  "evasive_denial": ["bhaira_hound", "dorma_hound", "hec_hound"],
  "fatal_attraction": ["djinn"],
  "fear_sense": ["adarza", "smeeta", "vasca"],
  "ferocity": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "fetch": ["adarza", "chesa", "crescent_vulpaphyla", "helminth_charger", "huras", "medjay_predasite", "panzer_vulpaphyla", "pharaoh_predasite", "raksa", "sahasa", "sly_vulpaphyla", "smeeta", "sunika", "vasca", "vizier_predasite"],
  "focused_prospectus": ["bhaira_hound", "dorma_hound", "hec_hound"],
  "ghost": ["prisma_shade", "shade", "shade_prime"],
  "guardian": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "hard_engage": ["lambeo", "nidus_moa", "olaro", "para"],
  "helminth_ferocity": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "howl": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "hunt": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "iatric_mycelium": ["medjay_predasite", "pharaoh_predasite", "vizier_predasite"],
  "infectious_bite": ["medjay_predasite", "pharaoh_predasite", "vizier_predasite"],
  "investigator": ["helios", "helios_prime"],
  "looter": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "martyr_symbiosis": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "medi_ray": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "melee_prowess_sentinel": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "mischief": ["adarza", "smeeta", "vasca"],
  "molecular_conversion": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "negate": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "neutralize": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "null_audit": ["bhaira_hound", "dorma_hound", "hec_hound"],
  "odomedic": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "panzer_devolution": ["crescent_vulpaphyla", "panzer_vulpaphyla", "sly_vulpaphyla"],
  "paralytic_spores": ["medjay_predasite", "pharaoh_predasite", "vizier_predasite"],
  "primed_regen": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "proboscis": ["adarza", "smeeta", "vasca"],
  "protect": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "reawaken": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "reflect": ["adarza", "smeeta", "vasca"],
  "reflex_denial": ["bhaira_hound", "dorma_hound", "hec_hound"],
  "regen": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "repo_audit": ["bhaira_hound", "dorma_hound", "hec_hound"],
  "retrieve": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "sacrifice": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "savagery": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "scan_aquatic": ["oxylus"],
  "scan_matter": ["oxylus"],
  "scavenge": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "security_override": ["lambeo", "nidus_moa", "olaro", "para"],
  "shield_charger": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "shockwave_actuators_r3": ["lambeo", "nidus_moa", "olaro", "para"],
  "sly_devolution": ["crescent_vulpaphyla", "panzer_vulpaphyla", "sly_vulpaphyla"],
  "stalk": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "stasis_field": ["lambeo", "nidus_moa", "olaro", "para"],
  "survival_instinct": ["crescent_vulpaphyla", "panzer_vulpaphyla", "sly_vulpaphyla"],
  "synergized_prospectus": ["bhaira_hound", "dorma_hound", "hec_hound"],
  "targeting_receptor": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "territorial_aggression_r3": ["adarza", "smeeta", "vasca"],
  "thumper": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "tractor_beam": ["lambeo", "nidus_moa", "olaro", "para"],
  "trample": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "transfusion": ["adarza", "smeeta", "vasca"],
  "unleashed": ["chesa", "helminth_charger", "huras", "raksa", "sahasa", "sunika"],
  "vacuum": ["carrier", "carrier_prime", "dethcube", "dethcube_prime", "diriga", "djinn", "helios", "helios_prime", "nautilus", "nautilus_prime", "oxylus", "prisma_shade", "shade", "shade_prime", "taxon", "wyrm", "wyrm_prime"],
  "vaporize": ["dethcube", "dethcube_prime"],
  "viral_quills": ["crescent_vulpaphyla", "panzer_vulpaphyla", "sly_vulpaphyla"],
  "volatile_parasite": ["medjay_predasite", "pharaoh_predasite", "vizier_predasite"],
  "whiplash_mine_r3": ["lambeo", "nidus_moa", "olaro", "para"],
} as const;

/** Precept with per-companion eligibility data (companion builder). */
export function isCataloguedCompanionPrecept(
  mod: Pick<Mod, "id" | "category" | "polarity">,
): boolean {
  return isCompanionPrecept(mod) && mod.id in COMPANION_PRECEPT_COMPANION_IDS;
}

const preceptCompanionIdSet = new Map<string, ReadonlySet<string>>(
  Object.entries(COMPANION_PRECEPT_COMPANION_IDS).map(([id, ids]) => [id, new Set(ids)]),
);

/** True when a penjaga precept can be equipped on this companion in the builder. */
export function companionPreceptEligibleForCompanion(
  companion: Pick<Companion, "id" | "type">,
  mod: Pick<Mod, "id" | "category" | "polarity">,
): boolean {
  if (!isCataloguedCompanionPrecept(mod)) return true;
  const allowed = preceptCompanionIdSet.get(mod.id);
  if (!allowed) return false;
  return allowed.has(companion.id);
}

/** Precept mods eligible for this companion (companion builder precept slots). */
export function companionPreceptModsForBuilder(
  companion: Pick<Companion, "id" | "type">,
  mods: readonly Mod[],
): Mod[] {
  return mods.filter(
    (m) =>
      isCataloguedCompanionPrecept(m)
      && companionPreceptEligibleForCompanion(companion, m),
  );
}

/** Stat mods for companion builder (excludes catalogued precepts). */
export function companionStatModsForBuilder(
  companion: Pick<Companion, "id" | "type">,
  mods: readonly Mod[],
  subCategories: readonly string[],
): Mod[] {
  return mods.filter((m) => {
    if (m.category !== "companion") return false;
    if (isCataloguedCompanionPrecept(m)) return false;
    if (isCompanionPrecept(m)) return false;
    return !m.subCategory || subCategories.includes(m.subCategory);
  });
}

/** Filter companion mods for the builder (excludes ineligible precepts). */
export function companionModEligibleInBuilder(
  companion: Pick<Companion, "id" | "type">,
  mod: Mod,
  subCategories: readonly string[],
): boolean {
  if (mod.category !== "companion") return false;
  if (isCataloguedCompanionPrecept(mod)) {
    return companionPreceptEligibleForCompanion(companion, mod);
  }
  if (isCompanionPrecept(mod)) return false;
  return !mod.subCategory || subCategories.includes(mod.subCategory);
}

