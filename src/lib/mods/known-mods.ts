/**
 * Saved builds, share links and loadouts can reference mod ids that were later
 * removed from the catalog (e.g. the fake "augmented_sonar"). Drop those entries
 * on load so they don't linger as invisible slot occupants and get re-saved.
 * Everything else that reads mods already skips unknown ids (calc, capacity,
 * previews) or shows the raw id (compare view).
 */
export function dropUnknownMods<T extends { modId: string }>(
  mods: readonly T[] | null | undefined,
  modsMap: Pick<Map<string, unknown>, "has">,
): T[] {
  return (mods ?? []).filter((m) => Boolean(m?.modId) && modsMap.has(m.modId));
}

/**
 * Mods the game renamed or replaced in place. Saved builds that still carry the old catalog id are
 * migrated to the current one instead of being dropped.
 * - link_shields → link_redirection, link_armor → link_fiber: wiki.warframe.com and fandom
 *   Patch History, Update 34.0 (2023-10-18): "Link Shields has been renamed to Link Redirection"
 *   / "Link Armor has been renamed to Link Fiber". WFCD uniqueNames KubrowLinkShieldMaxMod /
 *   KubrowLinkArmourMaxMod now belong to Link Redirection / Link Fiber.
 * - shotgun_spazz → shotgun_barrage: wiki.warframe.com Shotgun Barrage, Update 32.0 (2022-09-07):
 *   "Adjusted the name of Shotgun Spazz (including Amalgam version) to Shotgun Barrage."
 * - aura_speed_holster → holster_amp: wiki.warframe.com Holster Amp, Update 32.0 (2022-09-07):
 *   "Speed Holster Aura Mod: Renamed to Holster Amp" (its effect changed to +60% damage on equip).
 * - helminth_ferocity → proboscis: wiki.warframe.com Helminth Ferocity, Update 20.0 (2017-03-24):
 *   "Replaced by Proboscis" (infobox "Succeeded by Proboscis"; removed from inventories).
 * - augment_volt_reactive_storm → augment_baruuk_reactive_storm: Reactive Storm is Baruuk's Serene
 *   Storm augment (wiki.warframe.com Reactive Storm: Type Baruuk, Update 27.1). The catalog also
 *   carried a misspelled "ReactivStorm" copy tied to Volt; it was removed (Round 21).
 * - augment_vauban_repelling_bastille → enduring_bastille: wiki.warframe.com Enduring Bastille,
 *   Update 41.1 (2026-02-11): "Augment - Repelling Bastille: Renamed to \u201cEnduring Bastille\u201d"
 *   (Repelling Bastille redirects there). The catalog carried both ids as separate mods (Round 23).
 */
export const RENAMED_MOD_IDS: Readonly<Record<string, string>> = {
  link_shields: "link_redirection",
  link_armor: "link_fiber",
  shotgun_spazz: "shotgun_barrage",
  aura_speed_holster: "holster_amp",
  helminth_ferocity: "proboscis",
  augment_volt_reactive_storm: "augment_baruuk_reactive_storm",
  augment_vauban_repelling_bastille: "enduring_bastille",
};

/** Display names of the old ids (they are no longer in the catalog). */
export const RENAMED_MOD_OLD_NAMES: Readonly<Record<string, string>> = {
  link_shields: "Link Shields",
  link_armor: "Link Armor",
  shotgun_spazz: "Shotgun Spazz",
  aura_speed_holster: "Speed Holster",
  helminth_ferocity: "Helminth Ferocity",
  augment_volt_reactive_storm: "ReactivStorm (Volt)",
  augment_vauban_repelling_bastille: "Repelling Bastille",
};

/** Game update that renamed / replaced each old id (shown in the load toast). */
export const RENAMED_MOD_UPDATE: Readonly<Record<string, string>> = {
  link_shields: "Update 34",
  link_armor: "Update 34",
  shotgun_spazz: "Update 32",
  aura_speed_holster: "Update 32",
  helminth_ferocity: "Update 20",
  augment_vauban_repelling_bastille: "Update 41.1",
};

export type RetiredModReason = "archived" | "no_source" | "unreleased" | "focus_2" | "conclave";

/**
 * Mod ids removed from the catalog in Round 14b (Necramech Stamina: Round 25, not in game). Saved builds that still carry them drop them on
 * load with a warning. Sources: wiki.warframe.com (fandom as the second source).
 * - archived: augments the wikis mark {{Archived}} (Perpetual Vortex: "Combined into Repelling
 *   Bastille in Update 26.0").
 * - no_source: no page or data entry on either wiki, not in WFCD.
 * - unreleased: not listed as released on wiki.warframe.com (Primed Streamline is "Retrieved
 *   Content … currently unavailable publicly").
 * - focus_2: Focus 2.0 nodes; wiki.warframe.com Focus is "Preceded by Focus 2.0 since Update 31.5".
 */
export const RETIRED_MODS: Readonly<Record<string, { name: string; reason: RetiredModReason }>> = {
  augment_ember_flash_accelerant: { name: "Flash Accelerant", reason: "archived" },
  augment_ember_fire_fright: { name: "Fire Fright", reason: "archived" },
  firequake: { name: "Firequake", reason: "archived" },
  augment_vauban_tesla_link: { name: "Tesla Link", reason: "archived" },
  perpetual_vortex: { name: "Perpetual Vortex", reason: "archived" },
  augment_baruuk_endless_lull: { name: "Endless Lull", reason: "no_source" },
  aura_sprint_speed: { name: "Sprint Speed", reason: "no_source" },
  aura_looters: { name: "Looters", reason: "no_source" },
  berserker: { name: "Berserker", reason: "no_source" },
  necramech_stamina: { name: "Necramech Stamina", reason: "no_source" },
  primed_blunderbuss: { name: "Primed Blunderbuss", reason: "unreleased" },
  primed_charged_chamber: { name: "Primed Charged Chamber", reason: "unreleased" },
  primed_streamline: { name: "Primed Streamline", reason: "unreleased" },
  basilisk_gaze: { name: "Basilisk Gaze", reason: "focus_2" },
  basilisk_scales: { name: "Basilisk Scales", reason: "focus_2" },
  blazing_dash: { name: "Blazing Dash", reason: "focus_2" },
  crippling_dash: { name: "Crippling Dash", reason: "focus_2" },
  disarming_blast: { name: "Disarming Blast", reason: "focus_2" },
  disorienting_blast: { name: "Disorienting Blast", reason: "focus_2" },
  executing_dash: { name: "Executing Dash", reason: "focus_2" },
  flame_blast: { name: "Flame Blast", reason: "focus_2" },
  guardian_blast: { name: "Guardian Blast", reason: "focus_2" },
  magnetic_blast: { name: "Magnetic Blast", reason: "focus_2" },
  meteoric_dash: { name: "Meteoric Dash", reason: "focus_2" },
  mind_sprint: { name: "Mind Sprint", reason: "focus_2" },
  phoenix_spirit: { name: "Phoenix Spirit", reason: "focus_2" },
  rising_blast: { name: "Rising Blast", reason: "focus_2" },
  sonic_dash: { name: "Sonic Dash", reason: "focus_2" },
  sundering_dash: { name: "Sundering Dash", reason: "focus_2" },
  void_aegis: { name: "Void Aegis", reason: "focus_2" },
  void_chrysalis: { name: "Void Chrysalis", reason: "focus_2" },
  void_hunter: { name: "Void Hunter", reason: "focus_2" },
  void_radiance: { name: "Void Radiance", reason: "focus_2" },
  void_shadow: { name: "Void Shadow", reason: "focus_2" },
  void_singularity: { name: "Void Singularity", reason: "focus_2" },
  void_spines: { name: "Void Spines", reason: "focus_2" },
  void_stalker: { name: "Void Stalker", reason: "focus_2" },
  void_static: { name: "Void Static", reason: "focus_2" },
  voltaic_blast: { name: "Voltaic Blast", reason: "focus_2" },
};

export interface MigratedMod {
  fromModId: string;
  toModId: string;
  /** True when the current mod was already in the same list, so the old copy was dropped. */
  droppedAsDuplicate: boolean;
}

type ModEntry = { modId: string; rank?: number };

type RenameTarget = { maxRank?: number; name?: string; polarity?: string; drain?: number };

/**
 * Rewrite renamed mod ids in one mod list. The rank is kept (the game kept it) and clamped to the
 * current mod's max rank. Returns the same array when nothing changed.
 */
export function migrateRenamedMods<T extends ModEntry>(
  mods: readonly T[],
  modsMap: Pick<Map<string, RenameTarget>, "get">,
): { mods: T[]; migrated: MigratedMod[] } {
  const migrated: MigratedMod[] = [];
  if (!mods.some((m) => m && RENAMED_MOD_IDS[m.modId])) return { mods: mods as T[], migrated };
  const present = new Set(mods.map((m) => m?.modId));
  const out: T[] = [];
  for (const m of mods) {
    const to = m ? RENAMED_MOD_IDS[m.modId] : undefined;
    if (!to) {
      out.push(m);
      continue;
    }
    if (present.has(to)) {
      migrated.push({ fromModId: m.modId, toModId: to, droppedAsDuplicate: true });
      continue;
    }
    present.add(to);
    const target = modsMap.get(to);
    const maxRank = target?.maxRank;
    const rank = typeof m.rank === "number" && typeof maxRank === "number" ? Math.min(m.rank, maxRank) : m.rank;
    // Entries that cache display fields (EquippedMod) get the current mod's values.
    const cached: Record<string, unknown> = {};
    if (target && "modName" in m && target.name !== undefined) cached.modName = target.name;
    if (target && "polarity" in m && target.polarity !== undefined) cached.polarity = target.polarity;
    if (target && "drain" in m && target.drain !== undefined) cached.drain = target.drain;
    out.push({ ...m, ...cached, modId: to, ...(rank === undefined ? {} : { rank }) });
    migrated.push({ fromModId: m.modId, toModId: to, droppedAsDuplicate: false });
  }
  return { mods: out, migrated };
}

function isModList(value: unknown): value is ModEntry[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((v) => !!v && typeof v === "object" && typeof (v as ModEntry).modId === "string")
  );
}

/** Apply `fn` to every mod list in a saved build / loadout payload. Copies only on change. */
function mapModListsDeep<T>(data: T, fn: (mods: ModEntry[]) => ModEntry[]): T {
  const walk = (value: unknown, depth: number): unknown => {
    if (depth > 8 || !value || typeof value !== "object") return value;
    if (isModList(value)) return fn(value);
    let changed = false;
    if (Array.isArray(value)) {
      const next = value.map((v) => {
        const w = walk(v, depth + 1);
        if (w !== v) changed = true;
        return w;
      });
      return changed ? next : value;
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const w = walk(v, depth + 1);
      if (w !== v) changed = true;
      out[k] = w;
    }
    return changed ? out : value;
  };
  return walk(data, 0) as T;
}

/** migrateRenamedMods over every mod list in a saved build / loadout payload. Copy only on change. */
export function migrateRenamedModsDeep<T>(
  data: T,
  modsMap: Pick<Map<string, RenameTarget>, "get">,
): { data: T; migrated: MigratedMod[] } {
  const migrated: MigratedMod[] = [];
  const next = mapModListsDeep(data, (mods) => {
    const res = migrateRenamedMods(mods, modsMap);
    migrated.push(...res.migrated);
    return res.mods;
  });
  return { data: migrated.length ? next : data, migrated };
}

export interface RetiredModDrop {
  modId: string;
  name: string;
  reason: RetiredModReason;
}

/**
 * Why a mod id can't stay in a PvE build: removed from the catalog (RETIRED_MODS), or a
 * Conclave-only mod (catalog category "conclave", wiki "limited to player versus player missions").
 */
export function retiredModReason(
  modId: string,
  modsMap: Pick<Map<string, { category?: string; name?: string }>, "get">,
): { name: string; reason: RetiredModReason } | null {
  const retired = RETIRED_MODS[modId];
  if (retired) return retired;
  const mod = modsMap.get(modId);
  if (mod?.category === "conclave") return { name: mod.name ?? modId, reason: "conclave" };
  return null;
}

/** Drop retired / Conclave-only mods from one list. Returns the same array when nothing changed. */
export function dropRetiredMods<T extends { modId: string }>(
  mods: readonly T[],
  modsMap: Pick<Map<string, { category?: string; name?: string }>, "get">,
): { mods: T[]; dropped: RetiredModDrop[] } {
  const dropped: RetiredModDrop[] = [];
  const kept = mods.filter((m) => {
    const why = m ? retiredModReason(m.modId, modsMap) : null;
    if (why) dropped.push({ modId: m.modId, ...why });
    return !why;
  });
  return { mods: dropped.length ? kept : (mods as T[]), dropped };
}

/** dropRetiredMods over every mod list in a saved build / loadout payload. Copy only on change. */
export function dropRetiredModsDeep<T>(
  data: T,
  modsMap: Pick<Map<string, { category?: string; name?: string }>, "get">,
): { data: T; dropped: RetiredModDrop[] } {
  const dropped: RetiredModDrop[] = [];
  const next = mapModListsDeep(data, (mods) => {
    const res = dropRetiredMods(mods, modsMap);
    dropped.push(...res.dropped);
    return res.mods;
  });
  return { data: dropped.length ? next : data, dropped };
}

export interface ClampedModRank {
  modId: string;
  name: string;
  fromRank: number;
  toRank: number;
}

/**
 * Clamp saved ranks to each mod's current max rank (Round 17: Sure Footed, Rage, Charged Chamber,
 * Reach, … went from R5 to the game's R3; Intruder is unranked). Unknown mods and ranks at or below
 * the max are left alone. Returns the same array when nothing changed.
 */
export function clampModRanks<T extends ModEntry>(
  mods: readonly T[],
  modsMap: Pick<Map<string, { maxRank?: number; name?: string }>, "get">,
): { mods: T[]; clamped: ClampedModRank[] } {
  const clamped: ClampedModRank[] = [];
  const out = mods.map((m) => {
    const mod = m ? modsMap.get(m.modId) : undefined;
    const maxRank = mod?.maxRank;
    if (!mod || typeof maxRank !== "number" || typeof m.rank !== "number" || m.rank <= maxRank) return m;
    clamped.push({ modId: m.modId, name: mod.name ?? m.modId, fromRank: m.rank, toRank: maxRank });
    return { ...m, rank: maxRank };
  });
  return { mods: clamped.length ? out : (mods as T[]), clamped };
}

/** clampModRanks over every mod list in a saved build / loadout payload. Copy only on change. */
export function clampModRanksDeep<T>(
  data: T,
  modsMap: Pick<Map<string, { maxRank?: number; name?: string }>, "get">,
): { data: T; clamped: ClampedModRank[] } {
  const clamped: ClampedModRank[] = [];
  const next = mapModListsDeep(data, (mods) => {
    const res = clampModRanks(mods, modsMap);
    clamped.push(...res.clamped);
    return res.mods;
  });
  return { data: clamped.length ? next : data, clamped };
}
