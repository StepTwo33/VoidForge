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
 * Mods the game renamed in place (same item, same uniqueName, same rank). Saved builds that
 * still carry the old catalog id are migrated to the current one instead of being dropped.
 * - link_shields → link_redirection, link_armor → link_fiber: wiki.warframe.com and fandom
 *   Patch History, Update 34.0 (2023-10-18): "Link Shields has been renamed to Link Redirection"
 *   / "Link Armor has been renamed to Link Fiber". WFCD uniqueNames KubrowLinkShieldMaxMod /
 *   KubrowLinkArmourMaxMod now belong to Link Redirection / Link Fiber.
 */
export const RENAMED_MOD_IDS: Readonly<Record<string, string>> = {
  link_shields: "link_redirection",
  link_armor: "link_fiber",
};

/** Display names of the old ids (they are no longer in the catalog). */
export const RENAMED_MOD_OLD_NAMES: Readonly<Record<string, string>> = {
  link_shields: "Link Shields",
  link_armor: "Link Armor",
};

export interface MigratedMod {
  fromModId: string;
  toModId: string;
  /** True when the current mod was already in the same list, so the old copy was dropped. */
  droppedAsDuplicate: boolean;
}

type ModEntry = { modId: string; rank?: number };

/**
 * Rewrite renamed mod ids in one mod list. The rank is kept (the game kept it) and clamped to the
 * current mod's max rank. Returns the same array when nothing changed.
 */
export function migrateRenamedMods<T extends ModEntry>(
  mods: readonly T[],
  modsMap: Pick<Map<string, { maxRank?: number }>, "get">,
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
    const maxRank = modsMap.get(to)?.maxRank;
    const rank = typeof m.rank === "number" && typeof maxRank === "number" ? Math.min(m.rank, maxRank) : m.rank;
    out.push({ ...m, modId: to, ...(rank === undefined ? {} : { rank }) });
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

/** migrateRenamedMods over every mod list in a saved build / loadout payload. Copy only on change. */
export function migrateRenamedModsDeep<T>(
  data: T,
  modsMap: Pick<Map<string, { maxRank?: number }>, "get">,
): { data: T; migrated: MigratedMod[] } {
  const migrated: MigratedMod[] = [];
  const walk = (value: unknown, depth: number): unknown => {
    if (depth > 8 || !value || typeof value !== "object") return value;
    if (isModList(value)) {
      const res = migrateRenamedMods(value, modsMap);
      migrated.push(...res.migrated);
      return res.mods;
    }
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
  const next = walk(data, 0) as T;
  return { data: migrated.length ? next : data, migrated };
}

