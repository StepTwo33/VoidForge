/**
 * Helpers for the Share Builds list: skip empty drafts and collapse obvious duplicates
 * so the page only offers kits that are actually worth sending.
 */

export interface ShareableItem {
  id: string;
  name: string;
  type: string;
  updatedAt: number;
  data: unknown;
}

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function slotHasItem(slot: unknown, idKey: string): boolean {
  if (!slot || typeof slot !== "object") return false;
  const id = (slot as Record<string, unknown>)[idKey];
  return typeof id === "string" && id.trim().length > 0;
}

/** True when a loadout or saved build has nothing equipped — not worth sharing. */
export function isEmptyShareableItem(item: ShareableItem): boolean {
  const d = asRecord(item.data);
  if (item.type === "loadout") {
    return !(
      slotHasItem(d.warframeBuild, "warframeId") ||
      slotHasItem(d.primaryBuild, "weaponId") ||
      slotHasItem(d.secondaryBuild, "weaponId") ||
      slotHasItem(d.meleeBuild, "weaponId") ||
      slotHasItem(d.companionBuild, "companionId") ||
      slotHasItem(d.operatorBuild, "ampId") ||
      slotHasItem(d.operatorBuild, "focusSchool") ||
      slotHasItem(d.archwingBuild, "archwingId") ||
      slotHasItem(d.archwingBuild, "necramechId") ||
      (d.modularBuilds != null && typeof d.modularBuilds === "object" && Object.keys(d.modularBuilds as object).length > 0)
    );
  }
  const itemId =
    d.weaponId ??
    d.warframeId ??
    d.companionId ??
    d.archwingId ??
    d.railjackId ??
    d.ampId ??
    d.modularType;
  if (typeof itemId === "string" && itemId.trim()) return false;
  // Modular builds store parts under data.parts
  const parts = d.parts;
  if (parts && typeof parts === "object" && Object.values(parts as object).some((v) => typeof v === "string" && v)) {
    return false;
  }
  return true;
}

/**
 * Drop exact id duplicates, then same type+name (keep the newest). Empty drafts are removed first.
 */
export function prepareShareableItems<T extends ShareableItem>(items: T[]): T[] {
  const filled = items.filter((i) => !isEmptyShareableItem(i));
  const byId = new Map<string, T>();
  for (const i of filled) {
    const prev = byId.get(i.id);
    if (!prev || i.updatedAt >= prev.updatedAt) byId.set(i.id, i);
  }
  const byKey = new Map<string, T>();
  for (const i of byId.values()) {
    const key = `${i.type}::${i.name.trim().toLowerCase()}`;
    const prev = byKey.get(key);
    if (!prev || i.updatedAt >= prev.updatedAt) byKey.set(key, i);
  }
  return [...byKey.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}
