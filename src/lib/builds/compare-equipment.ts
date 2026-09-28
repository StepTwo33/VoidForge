import type { EquippedArchonShard, ModSlot } from "@/lib/types";
import { resolveArcaneById } from "@/lib/builds/build-storage";
import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import { getShardColorName, SHARD_BONUS_LABELS } from "@/lib/display/shard-display";

export type GearDiffStatus = "onlyA" | "onlyB" | "changed" | "same";

export interface GearDiffRow {
  key: string;
  status: GearDiffStatus;
  aLabel: string | null;
  bLabel: string | null;
  /** Optional image path for A / B chips. */
  aImage?: string | null;
  bImage?: string | null;
}

export interface CompareEquipmentGroup {
  id: string;
  label: string;
  mods: ModSlot[];
  arcaneIds?: (string | null)[];
  arcaneRanks?: number[];
  shards?: (EquippedArchonShard | null)[];
  stanceModId?: string;
}

export interface CompareEquipment {
  groups: CompareEquipmentGroup[];
}

export function emptyEquipment(): CompareEquipment {
  return { groups: [] };
}

export function equipmentGroup(
  id: string,
  label: string,
  partial: Omit<CompareEquipmentGroup, "id" | "label">,
): CompareEquipmentGroup {
  return { id, label, ...partial, mods: partial.mods ?? [] };
}

function modLabel(modId: string, rank: number, modsMap = getEffectiveModsMap()): string {
  const mod = modsMap.get(modId);
  const name = mod?.name ?? modId;
  return rank > 0 ? `${name} R${rank}` : name;
}

function arcaneLabel(id: string | null | undefined, rank?: number): string | null {
  if (!id) return null;
  const arcane = resolveArcaneById(id);
  const name = arcane?.name ?? id;
  return rank != null && rank > 0 ? `${name} R${rank}` : name;
}

function shardLabel(shard: EquippedArchonShard): string {
  const color = getShardColorName(shard.shardColor);
  const tau = shard.shardTier === 2 ? " τ" : "";
  const bonus =
    SHARD_BONUS_LABELS[shard.selectedBonus] ??
    shard.selectedBonus.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  const value = shard.bonusValue !== 0 ? ` +${shard.bonusValue}` : "";
  return `${color}${tau} · ${bonus}${value}`;
}

function shardKey(shard: EquippedArchonShard): string {
  return `${shard.shardId}|${shard.shardTier}|${shard.selectedBonus}|${shard.bonusValue}`;
}

/** Set-wise mod diff by modId (rank changes → changed). */
export function diffMods(a: ModSlot[], b: ModSlot[], stanceA?: string, stanceB?: string): GearDiffRow[] {
  const modsMap = getEffectiveModsMap();
  const aMap = new Map<string, ModSlot>();
  for (const m of a) aMap.set(m.modId, m);
  const bMap = new Map<string, ModSlot>();
  for (const m of b) bMap.set(m.modId, m);

  const rows: GearDiffRow[] = [];
  const ids = new Set([...aMap.keys(), ...bMap.keys()]);

  // Stance as a pseudo-mod when present
  if (stanceA || stanceB) {
    const aName = stanceA ? modLabel(stanceA, 0, modsMap) + " (Stance)" : null;
    const bName = stanceB ? modLabel(stanceB, 0, modsMap) + " (Stance)" : null;
    let status: GearDiffStatus = "same";
    if (stanceA && !stanceB) status = "onlyA";
    else if (!stanceA && stanceB) status = "onlyB";
    else if (stanceA !== stanceB) status = "changed";
    if (status !== "same") {
      rows.push({ key: "stance", status, aLabel: aName, bLabel: bName });
    }
  }

  for (const id of [...ids].sort((x, y) => {
    const na = modsMap.get(x)?.name ?? x;
    const nb = modsMap.get(y)?.name ?? y;
    return na.localeCompare(nb);
  })) {
    const left = aMap.get(id);
    const right = bMap.get(id);
    if (left && !right) {
      rows.push({ key: id, status: "onlyA", aLabel: modLabel(id, left.rank, modsMap), bLabel: null });
    } else if (!left && right) {
      rows.push({ key: id, status: "onlyB", aLabel: null, bLabel: modLabel(id, right.rank, modsMap) });
    } else if (left && right) {
      if (left.rank !== right.rank) {
        rows.push({
          key: id,
          status: "changed",
          aLabel: modLabel(id, left.rank, modsMap),
          bLabel: modLabel(id, right.rank, modsMap),
        });
      }
      // same id+rank → omit from compact list
    }
  }
  return rows;
}

/** Slot-index arcane diff. */
export function diffArcanes(
  aIds: (string | null)[] | undefined,
  bIds: (string | null)[] | undefined,
  aRanks?: number[],
  bRanks?: number[],
): GearDiffRow[] {
  const len = Math.max(aIds?.length ?? 0, bIds?.length ?? 0, 2);
  const rows: GearDiffRow[] = [];
  for (let i = 0; i < len; i++) {
    const aId = aIds?.[i] ?? null;
    const bId = bIds?.[i] ?? null;
    const aRank = aRanks?.[i];
    const bRank = bRanks?.[i];
    if (!aId && !bId) continue;
    if (aId && !bId) {
      rows.push({ key: `arcane-${i}`, status: "onlyA", aLabel: arcaneLabel(aId, aRank), bLabel: null });
    } else if (!aId && bId) {
      rows.push({ key: `arcane-${i}`, status: "onlyB", aLabel: null, bLabel: arcaneLabel(bId, bRank) });
    } else if (aId !== bId || (aRank ?? 0) !== (bRank ?? 0)) {
      rows.push({
        key: `arcane-${i}`,
        status: "changed",
        aLabel: arcaneLabel(aId, aRank),
        bLabel: arcaneLabel(bId, bRank),
      });
    }
  }
  return rows;
}

/** Slot-index shard diff. */
export function diffShards(
  a: (EquippedArchonShard | null)[] | undefined,
  b: (EquippedArchonShard | null)[] | undefined,
): GearDiffRow[] {
  const len = Math.max(a?.length ?? 0, b?.length ?? 0, 5);
  const rows: GearDiffRow[] = [];
  for (let i = 0; i < len; i++) {
    const left = a?.[i] ?? null;
    const right = b?.[i] ?? null;
    if (!left && !right) continue;
    if (left && !right) {
      rows.push({ key: `shard-${i}`, status: "onlyA", aLabel: shardLabel(left), bLabel: null });
    } else if (!left && right) {
      rows.push({ key: `shard-${i}`, status: "onlyB", aLabel: null, bLabel: shardLabel(right) });
    } else if (left && right && shardKey(left) !== shardKey(right)) {
      rows.push({
        key: `shard-${i}`,
        status: "changed",
        aLabel: shardLabel(left),
        bLabel: shardLabel(right),
      });
    }
  }
  return rows;
}

export interface GroupDiffResult {
  groupId: string;
  groupLabel: string;
  modRows: GearDiffRow[];
  arcaneRows: GearDiffRow[];
  shardRows: GearDiffRow[];
  tally: { onlyA: number; onlyB: number; changed: number };
}

function tallyRows(rows: GearDiffRow[]): { onlyA: number; onlyB: number; changed: number } {
  let onlyA = 0;
  let onlyB = 0;
  let changed = 0;
  for (const r of rows) {
    if (r.status === "onlyA") onlyA++;
    else if (r.status === "onlyB") onlyB++;
    else if (r.status === "changed") changed++;
  }
  return { onlyA, onlyB, changed };
}

export function diffEquipmentGroups(
  a: CompareEquipment | undefined,
  b: CompareEquipment | undefined,
): GroupDiffResult[] {
  const aGroups = a?.groups ?? [];
  const bGroups = b?.groups ?? [];
  const ids = new Set([...aGroups.map((g) => g.id), ...bGroups.map((g) => g.id)]);
  const results: GroupDiffResult[] = [];

  for (const id of ids) {
    const ga = aGroups.find((g) => g.id === id);
    const gb = bGroups.find((g) => g.id === id);
    if (!ga && !gb) continue;
    const label = ga?.label ?? gb?.label ?? id;
    const modRows = diffMods(ga?.mods ?? [], gb?.mods ?? [], ga?.stanceModId, gb?.stanceModId);
    const arcaneRows = diffArcanes(ga?.arcaneIds, gb?.arcaneIds, ga?.arcaneRanks, gb?.arcaneRanks);
    const shardRows = diffShards(ga?.shards, gb?.shards);
    const all = [...modRows, ...arcaneRows, ...shardRows];
    const t = tallyRows(all);
    if (t.onlyA === 0 && t.onlyB === 0 && t.changed === 0) {
      // Still include if either side has any gear (for slot grid expand)
      const hasGear =
        (ga?.mods.length ?? 0) > 0 ||
        (gb?.mods.length ?? 0) > 0 ||
        (ga?.arcaneIds?.some(Boolean) ?? false) ||
        (gb?.arcaneIds?.some(Boolean) ?? false) ||
        (ga?.shards?.some(Boolean) ?? false) ||
        (gb?.shards?.some(Boolean) ?? false) ||
        !!ga?.stanceModId ||
        !!gb?.stanceModId;
      if (!hasGear) continue;
    }
    results.push({
      groupId: id,
      groupLabel: label,
      modRows,
      arcaneRows,
      shardRows,
      tally: t,
    });
  }
  return results;
}

export function equipmentHasAny(eq: CompareEquipment | undefined): boolean {
  if (!eq) return false;
  return eq.groups.some(
    (g) =>
      g.mods.length > 0 ||
      !!g.stanceModId ||
      (g.arcaneIds?.some(Boolean) ?? false) ||
      (g.shards?.some(Boolean) ?? false),
  );
}

/** Slot-wise pairing for expandable grids (by slotIndex). */
export function pairModSlots(
  a: ModSlot[],
  b: ModSlot[],
): { slotIndex: number; a: ModSlot | null; b: ModSlot | null; differs: boolean }[] {
  const indices = new Set<number>();
  for (const m of a) indices.add(m.slotIndex);
  for (const m of b) indices.add(m.slotIndex);
  // Always show a reasonable grid even if sparse
  const maxIdx = indices.size > 0 ? Math.max(...indices, 7) : -1;
  if (maxIdx < 0 && a.length === 0 && b.length === 0) return [];
  const byA = new Map(a.map((m) => [m.slotIndex, m]));
  const byB = new Map(b.map((m) => [m.slotIndex, m]));
  const out: { slotIndex: number; a: ModSlot | null; b: ModSlot | null; differs: boolean }[] = [];
  const slots = indices.size > 0 ? [...indices].sort((x, y) => x - y) : [];
  // If both empty-ish but we had stance-only, skip
  for (const i of slots) {
    const left = byA.get(i) ?? null;
    const right = byB.get(i) ?? null;
    const differs =
      (left?.modId ?? null) !== (right?.modId ?? null) ||
      (left?.rank ?? 0) !== (right?.rank ?? 0);
    out.push({ slotIndex: i, a: left, b: right, differs });
  }
  return out;
}

export function resolveModDisplay(modId: string, rank: number): { name: string; rankLabel: string } {
  const mod = getEffectiveModsMap().get(modId);
  const name = mod?.name ?? modId;
  return { name, rankLabel: rank > 0 ? `R${rank}` : "" };
}

export function resolveArcaneDisplay(id: string | null): string | null {
  if (!id) return null;
  return resolveArcaneById(id)?.name ?? id;
}
