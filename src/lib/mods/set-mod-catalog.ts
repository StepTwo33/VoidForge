import type { Mod } from "@/lib/types";

/** Wiki-sync internal ids (`*setmod`) map to canonical set bonus entries. */
export const LEGACY_SETMOD_TO_CANONICAL: Record<string, string> = {
  amarsetmod: "set_bonus_amar",
  ashensetmod: "set_bonus_carnis",
  augursetmod: "set_bonus_augur",
  bonebladesetmod: "set_bonus_jugulus",
  borealsetmod: "set_bonus_boreal",
  femursetmod: "set_bonus_saxum",
  gladiatorsetmod: "set_bonus_gladiator",
  hawksetmod: "set_bonus_aero",
  huntersetmod: "set_bonus_hunter",
  mechasetmod: "set_bonus_mecha",
  nirasetmod: "set_bonus_nira",
  raptorsetmod: "set_bonus_motus",
  sacrificesetmod: "set_bonus_sacrificial",
  spidersetmod: "set_bonus_proton",
  strainsetmod: "set_bonus_strain",
  synthsetmod: "set_bonus_synth",
  teksetmod: "set_bonus_tek",
  umbrasetmod: "set_bonus_umbral",
  vigilantesetmod: "set_bonus_vigilante",
};

/** Metadata for set bonuses that only existed as internal wiki `*setmod` rows. */
export const SET_BONUS_DEFINITIONS: Record<
  string,
  { label: string; pieces: number; description: string }
> = {
  set_bonus_amar: {
    label: "Amar Set Bonus",
    pieces: 3,
    description: "Teleport to a target within 10m per piece on using a Heavy Attack: 1/2/3 pieces = 10/20/30m.",
  },
  set_bonus_aero: {
    label: "Aero Set Bonus",
    pieces: 3,
    description:
      "Damage enemies while Aim Gliding and put up to 5 of them to Sleep on landing for 3s per piece: 1/2/3 pieces = 3/6/9s.",
  },
  set_bonus_boreal: {
    label: "Boreal Set Bonus",
    pieces: 3,
    description: "Reduces damage taken by 20% while airborne per piece: 1/2/3 pieces = 20/40/60%.",
  },
  set_bonus_carnis: {
    label: "Carnis Set Bonus",
    pieces: 3,
    description:
      "Killing an enemy with a Heavy Attack grants 10% Evasion and immunity to Status Effects for 2s per piece: 1/2/3 pieces = 10/20/30% for 2/4/6s.",
  },
  set_bonus_jugulus: {
    label: "Jugulus Set Bonus",
    pieces: 3,
    description:
      "Slam attacks manifest Tendrils to lash enemies within 3/4/5m for 25/50/75 Puncture Damage (12/9/6s cooldown).",
  },
  set_bonus_motus: {
    label: "Motus Set Bonus",
    pieces: 3,
    description: "+33% chance per piece to become immune to Knockdown effects while airborne: 1/2/3 pieces = 33/67/100%.",
  },
  set_bonus_nira: {
    label: "Nira Set Bonus",
    pieces: 3,
    description: "Increase damage from Slam Attacks by +150% per piece: 1/2/3 pieces = +150%/+300%/+450%.",
  },
  set_bonus_proton: {
    label: "Proton Set Bonus",
    pieces: 3,
    description: "During a Wall Latch, gain +17% Damage Reduction per piece: 1/2/3 pieces = 17/33/50%.",
  },
  set_bonus_sacrificial: {
    label: "Sacrificial Set Bonus",
    pieces: 2,
    description: "2-piece: Sacrificial Steel and Sacrificial Pressure effects +25% when both are equipped.",
  },
  set_bonus_saxum: {
    label: "Saxum Set Bonus",
    pieces: 3,
    description:
      "Lifted enemies explode on death for 10/20/30% of their max Health as Impact Damage in a 4/8/12m radius (6s cooldown).",
  },
  set_bonus_strain: {
    label: "Strain Set Bonus",
    pieces: 4,
    description: "Grows up to 2/4/6/8 Cysts over 6/12/18/24s that erupt every 25s to spawn a maggot.",
  },
  set_bonus_umbral: {
    label: "Umbral Set Bonus",
    pieces: 3,
    description:
      "2-piece: +30% Health/Armor and +25% Strength on Umbral mods. 3-piece: +80% / +75%.",
  },
};

export function isLegacySetModId(id: string): boolean {
  return id.endsWith("setmod");
}

export function isSetBonusMod(mod: Pick<Mod, "id" | "category">): boolean {
  return mod.category === "set" || isLegacySetModId(mod.id);
}

export function isEquippableMod(mod: Pick<Mod, "id" | "category">): boolean {
  return !isSetBonusMod(mod);
}

export function getSetBonusPieces(mod: Pick<Mod, "id" | "maxRank">): number {
  const def = SET_BONUS_DEFINITIONS[mod.id];
  if (def) return def.pieces;
  if (mod.id.startsWith("set_bonus_")) return mod.maxRank || 0;
  return mod.maxRank || 0;
}

function toSetBonusMod(
  id: string,
  def: { label: string; pieces: number; description: string },
  existing?: Mod,
): Mod {
  return {
    id,
    name: def.label,
    polarity: "universal",
    drain: 0,
    maxRank: def.pieces,
    category: "set",
    subCategory: "bonus",
    stats: existing?.stats ?? {},
    description: def.description,
    rarity: existing?.rarity ?? "legendary",
    imagePath: existing?.imagePath,
  };
}

/** Drop internal wiki set rows, dedupe against canonical set bonuses, and normalize metadata. */
export function normalizeModCatalog(rawMods: Mod[]): Mod[] {
  const normalizedById = new Map<string, Mod>();

  for (const mod of rawMods) {
    if (isLegacySetModId(mod.id)) continue;
    normalizedById.set(mod.id, mod);
  }

  for (const [id, def] of Object.entries(SET_BONUS_DEFINITIONS)) {
    normalizedById.set(id, toSetBonusMod(id, def, normalizedById.get(id)));
  }

  for (const mod of [...normalizedById.values()]) {
    if (mod.category === "set" && mod.id.startsWith("set_bonus_") && !SET_BONUS_DEFINITIONS[mod.id]) {
      normalizedById.set(mod.id, {
        ...mod,
        category: "set",
        subCategory: mod.subCategory || "bonus",
        drain: 0,
        polarity: mod.polarity || "universal",
      });
    }
  }

  for (const [legacyId, canonicalId] of Object.entries(LEGACY_SETMOD_TO_CANONICAL)) {
    const canonical = normalizedById.get(canonicalId);
    if (canonical) normalizedById.set(legacyId, canonical);
  }

  const emitted = new Set<string>();
  const result: Mod[] = [];
  for (const mod of rawMods) {
    if (isLegacySetModId(mod.id)) {
      const canonical = LEGACY_SETMOD_TO_CANONICAL[mod.id];
      if (!canonical) continue;
      const entry = normalizedById.get(canonical);
      if (entry && !emitted.has(canonical)) {
        result.push(entry);
        emitted.add(canonical);
      }
      continue;
    }
    if (emitted.has(mod.id)) continue;
    result.push(normalizedById.get(mod.id) ?? mod);
    emitted.add(mod.id);
  }

  return result;
}
