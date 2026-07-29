import type { Mod } from "@/lib/types";
import type { PlexusAbilityCategory } from "@/lib/codex/railjack-abilities";
import { RAILJACK_PLEXUS_ABILITIES } from "@/lib/codex/railjack-abilities";
import { isRailjackMod, type RailjackModRef } from "@/data/railjack";

export type PlexusModTab = "integrated" | "battle" | "tactical";

/** Wiki Plexus Aura (Matrix) mods — Integrated aura slot only. */
export const RAILJACK_AURA_MOD_IDS = new Set([
  "indomitable_matrix",
  "ironclad_matrix",
  "onslaught_matrix",
  "orgone_tuning_matrix",
  "raider_matrix",
]);

/**
 * Wiki Integrated (non-aura) Plexus mods.
 * @see https://wiki.warframe.com/w/Plexus_Mods
 */
export const RAILJACK_INTEGRATED_MOD_IDS = new Set([
  // Engines
  "conic_nozzle",
  "cruising_speed",
  "ion_burn",
  // Turrets
  "crimson_fugue",
  "fortifying_fire",
  "defensive_fire",
  "hyperstrike",
  "predator",
  "protective_shots",
  "section_density",
  "turret_velocity",
  "waveband_disruptor",
  // Faction
  "granums_nemesis",
  "sentient_scalpel",
  "worms_torment",
  // Ordnance
  "ordnance_cheap_shot",
  "ordnance_velocity",
  "overloader",
  "lock_and_load",
  "ripload",
  "scourging_warheads",
  "warhead",
  // Artillery
  "artillery_cheap_shot",
  "forward_artillery",
  // Forge
  "revo_reducer",
]);

/** Battle Plexus abilities (Forward Artillery is an Integrated mod in-game). */
export const RAILJACK_BATTLE_MOD_IDS = new Set([
  "munitions_vortex",
  "particle_ram",
  "phoenix_blaze",
  "blackout_pulse",
  "void_hole",
  "tether",
  "seeker_volley",
  "shatter_burst",
  "countermeasures",
]);

/** Tactical Plexus abilities. */
export const RAILJACK_TACTICAL_MOD_IDS = new Set([
  "death_blossom",
  "intruder_stasis",
  "void_cloak",
  "flow_burn",
  "form_up",
  "fire_suppression",
  "battle_stations",
  "squad_renew",
  "breach_quanta",
  "battle_forge",
]);

export const PLEXUS_ABILITY_SLOT_CATEGORIES: PlexusAbilityCategory[] = [
  "defensive",
  "offensive",
  "super",
];

export const PLEXUS_ABILITY_SLOT_LABELS: Record<PlexusAbilityCategory, string> = {
  defensive: "Defensive",
  offensive: "Offensive",
  super: "Super",
};

export const INTEGRATED_AURA_SLOT = 0;

export function isRailjackAuraMod(mod: Pick<Mod, "id">): boolean {
  return RAILJACK_AURA_MOD_IDS.has(mod.id);
}

export function getPlexusModTab(mod: Pick<Mod, "id">): PlexusModTab {
  if (RAILJACK_BATTLE_MOD_IDS.has(mod.id)) return "battle";
  if (RAILJACK_TACTICAL_MOD_IDS.has(mod.id)) return "tactical";
  return "integrated";
}

export function getPlexusAbilityCategory(
  modId: string,
): PlexusAbilityCategory | undefined {
  return RAILJACK_PLEXUS_ABILITIES[modId]?.category;
}

export function plexusModAllowedInTab(mod: Pick<Mod, "id">, tab: PlexusModTab): boolean {
  return getPlexusModTab(mod) === tab;
}

/** Integrated regular slots: non-aura Integrated only. */
export function plexusModAllowedInIntegratedSlot(
  mod: Pick<Mod, "id">,
  slotIndex: number,
): boolean {
  if (getPlexusModTab(mod) !== "integrated") return false;
  const isAura = isRailjackAuraMod(mod);
  if (slotIndex === INTEGRATED_AURA_SLOT) return isAura;
  return !isAura;
}

/** Battle/Tactical: one Defensive / Offensive / Super per tab. */
export function plexusModAllowedInAbilitySlot(
  mod: Pick<Mod, "id">,
  tab: "battle" | "tactical",
  slotIndex: number,
): boolean {
  if (getPlexusModTab(mod) !== tab) return false;
  const category = PLEXUS_ABILITY_SLOT_CATEGORIES[slotIndex];
  if (!category) return false;
  return getPlexusAbilityCategory(mod.id) === category;
}

export function filterRailjackModsForTab(mods: Mod[], tab: PlexusModTab): Mod[] {
  return mods.filter((m) => plexusModAllowedInTab(m, tab));
}

export function filterRailjackModsForSlot(
  mods: Mod[],
  tab: PlexusModTab,
  slotIndex: number,
): Mod[] {
  if (tab === "integrated") {
    return mods.filter((m) => plexusModAllowedInIntegratedSlot(m, slotIndex));
  }
  return mods.filter((m) => plexusModAllowedInAbilitySlot(m, tab, slotIndex));
}

/** Prefer explicit wiki allowlists; keep keyword fallback for unknown general mods. */
export function isVerifiedRailjackPlexusMod(mod: RailjackModRef): boolean {
  if (RAILJACK_AURA_MOD_IDS.has(mod.id)) return true;
  if (RAILJACK_INTEGRATED_MOD_IDS.has(mod.id)) return true;
  if (RAILJACK_BATTLE_MOD_IDS.has(mod.id)) return true;
  if (RAILJACK_TACTICAL_MOD_IDS.has(mod.id)) return true;
  return isRailjackMod(mod);
}

export function isRailjackPlexusMod(mod: RailjackModRef): boolean {
  return isVerifiedRailjackPlexusMod(mod);
}

/**
 * Soft-migrate equipped mods into correct aura / D-O-S slots.
 * Keeps at most one mod per target slot; drops conflicts / unknowns.
 */
export function migratePlexusModsToSlots(
  equipped: { modId: string; rank: number; slotIndex: number }[],
  tab: PlexusModTab,
): { modId: string; rank: number; slotIndex: number }[] {
  const bySlot = new Map<number, { modId: string; rank: number; slotIndex: number }>();

  for (const m of equipped) {
    if (tab === "integrated") {
      const isAura = isRailjackAuraMod({ id: m.modId });
      if (isAura) {
        if (!bySlot.has(INTEGRATED_AURA_SLOT)) {
          bySlot.set(INTEGRATED_AURA_SLOT, { ...m, slotIndex: INTEGRATED_AURA_SLOT });
        }
        continue;
      }
      // Non-aura stuck in aura slot → first free regular slot 1–8
      let slot = m.slotIndex === INTEGRATED_AURA_SLOT ? -1 : m.slotIndex;
      if (slot < 1 || slot > 8 || bySlot.has(slot)) {
        slot = -1;
        for (let i = 1; i <= 8; i++) {
          if (!bySlot.has(i)) {
            slot = i;
            break;
          }
        }
      }
      if (slot >= 1) bySlot.set(slot, { ...m, slotIndex: slot });
      continue;
    }

    const category = getPlexusAbilityCategory(m.modId);
    if (!category || RAILJACK_PLEXUS_ABILITIES[m.modId]?.tab !== tab) continue;
    const slot = PLEXUS_ABILITY_SLOT_CATEGORIES.indexOf(category);
    if (slot < 0 || bySlot.has(slot)) continue;
    bySlot.set(slot, { ...m, slotIndex: slot });
  }

  return [...bySlot.values()].sort((a, b) => a.slotIndex - b.slotIndex);
}
