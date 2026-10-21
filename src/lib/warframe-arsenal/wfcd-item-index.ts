/**
 * Process-wide uniqueName index over @wfcd/items.
 *
 * `@wfcd/items/utilities` `find.findItem` builds `new Items()` (every category, with
 * component resolution) on every call, and the arsenal parser calls it once per item and
 * mod: about 10 s of CPU per Player Sync import. This builds the same list once and answers
 * lookups from a Map. Results are deep copies, because callers (the parser) delete fields
 * off what they get back, as they could with the fresh objects the original returned.
 */
import Items from "@wfcd/items";
import { translatePolarity } from "warframe-worldstate-data/utilities";

type RawItem = Record<string, unknown> & { uniqueName: string };

let index: Map<string, RawItem> | null = null;

function getIndex(): Map<string, RawItem> {
  if (index) return index;
  const next = new Map<string, RawItem>();
  for (const item of new Items() as unknown as Array<RawItem | null | undefined>) {
    // First match wins, like the original Array#find.
    if (item && item.uniqueName && !next.has(item.uniqueName)) next.set(item.uniqueName, item);
  }
  index = next;
  return index;
}

/** Drop-in for `find.findItem`: a fresh copy of the first item with this unique name. */
export function findItem(uniqueName: string): RawItem | undefined {
  const item = getIndex().get(uniqueName);
  return item ? structuredClone(item) : undefined;
}

interface Upgrade {
  uniqueName: string;
  rank?: number;
  pol?: string;
  buffs?: unknown;
  curses?: unknown;
  lvlReq?: number;
}

/** Drop-in for `find.loadMods` (same logic as @wfcd/items/utilities/find.mjs, cached lookups). */
export function loadMods(upgrades: Upgrade[] = []) {
  const arcanes: Record<string, unknown>[] = [];
  const mods: Record<string, unknown>[] = [];
  upgrades.forEach((upgrade) => {
    const found = findItem(upgrade.uniqueName);
    let upgradeData: Record<string, unknown> = found ? { ...found } : { ...upgrade };

    upgradeData.rank = upgrade.rank;
    upgradeData.uniqueName = upgrade.uniqueName;
    if (upgradeData.levelStats) {
      const levelStats = upgradeData.levelStats as unknown[];
      upgradeData.levelStats = levelStats[upgrade.rank as number] || levelStats;
    }
    delete upgradeData.drops;
    delete upgradeData.patchlogs;

    if (upgradeData.category === "Arcanes") {
      delete upgradeData.tradable;
      arcanes.push(upgradeData);
    } else if (upgradeData.category === "Mods") {
      if (String(upgradeData.name).includes("Riven Mod")) {
        upgradeData = {
          uniqueName: upgradeData.uniqueName,
          polarity: translatePolarity(upgrade.pol as string),
          rarity: upgradeData.rarity,
          baseDrain: Number(upgradeData.baseDrain),
          fusionLimit: upgradeData.fusionLimit,
          imageName: upgradeData.imageName,
          category: upgradeData.category,
          tradable: upgradeData.tradable,
          wikiaThumbnail: upgradeData.wikiaThumbnail || undefined,
          wikiaUrl: upgradeData.wikiaUrl || undefined,
          buffs: upgrade.buffs,
          curses: upgrade.curses,
          masteryReq: upgrade.lvlReq,
        };
      }
      delete upgradeData.transmutable;
      delete upgradeData.tradable;
      mods.push(upgradeData);
    }
  });
  return { arcanes, mods };
}

export const find = { findItem, loadMods };
