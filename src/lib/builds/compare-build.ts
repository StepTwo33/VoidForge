import type {
  ArchwingCalculatedStats,
  CalculatedStats,
  CompanionCalculatedStats,
  ModularBuildData,
  ModSlot,
  SetBonusLinkage,
  WarframeCalculatedStats,
} from "@/lib/types";
import type { ArchwingBuildData, CompanionBuildData, WarframeBuildData, WeaponBuildData } from "@/lib/builds/build-storage";
import { resolveSavedArcaneSlots } from "@/lib/builds/build-storage";
import { extractBuildItemId } from "@/lib/builds/build-types";
import { resolvePublicBuildWarframePreview } from "@/lib/builds/build-stats";
import { calcSavedWeaponBuildStats, scenarioSimParams } from "@/lib/builds/loadout-stats";
import { weaponFromModularData } from "@/lib/builds/modular-resolve";
import { calculateWeaponBuild, calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { calculateCompanionBuild } from "@/lib/calc/companion-calculator";
import { calculateArchwingBuild, calculateNecramechBuild } from "@/lib/calc/archwing-calculator";
import { resolveCompanionParts } from "@/lib/companions/companion-parts-resolve";
import type { ModularCompanionParts } from "@/data/companion-parts";
import { resolveHoundWeaponId, resolveDefaultCompanionWeapon } from "@/lib/weapons/companion-weapons";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { normalizeArchwingId } from "@/lib/mods/archwing-augment-mods";
import {
  getEffectiveArchwings,
  getEffectiveCompanionsMap,
  getEffectiveModsMap,
  getEffectiveNecramechs,
  getEffectiveWeapons,
  getEffectiveWeaponsMap,
} from "@/lib/weapons/effective-data";

export type CompareKind = "weapon" | "warframe" | "companion" | "modular" | "archwing";

export type CompareSnapshot =
  | { kind: "weapon"; label: string; stats: CalculatedStats }
  | { kind: "warframe"; label: string; stats: WarframeCalculatedStats }
  | {
      kind: "companion";
      label: string;
      body: CompanionCalculatedStats;
      weapon: CalculatedStats | null;
      weaponName: string | null;
    }
  | { kind: "modular"; label: string; stats: CalculatedStats }
  | {
      kind: "archwing";
      label: string;
      frame: ArchwingCalculatedStats;
      weapon: CalculatedStats | null;
      weaponName: string | null;
    };

function moddedWeaponStats(
  weaponIdOrWeapon: string | import("@/lib/types").Weapon,
  mods: ModSlot[],
  arcaneIds?: (string | null)[],
  linkage?: SetBonusLinkage,
): CalculatedStats | null {
  const weapon = typeof weaponIdOrWeapon === "string"
    ? getEffectiveWeaponsMap().get(weaponIdOrWeapon)
    : weaponIdOrWeapon;
  if (!weapon) return null;
  const modsMap = getEffectiveModsMap();
  const sim = scenarioSimParams("midFight");
  const arcanes = resolveSavedArcaneSlots(arcaneIds, arcaneIds?.length ?? 0).filter((a): a is NonNullable<typeof a> => a != null);
  if (arcanes.length > 0) {
    return calculateWeaponBuildWithArcanes(weapon, mods, modsMap, arcanes, undefined, sim, undefined, linkage);
  }
  return calculateWeaponBuild(enrichWeapon(weapon), mods, modsMap, undefined, sim, undefined, linkage);
}

function companionSnapshot(label: string, data: CompanionBuildData): CompareSnapshot | null {
  const companion = getEffectiveCompanionsMap().get(data.companionId);
  if (!companion) return null;
  const parts = data.parts as ModularCompanionParts | undefined;
  const body = calculateCompanionBuild(companion, data.mods ?? [], getEffectiveModsMap(), parts ?? null);
  const fromParts = parts ? resolveCompanionParts(parts)?.weaponId : undefined;
  const weaponId =
    data.weaponId ??
    fromParts ??
    resolveHoundWeaponId(companion) ??
    ((data.weaponMods?.length ?? 0) > 0
      ? resolveDefaultCompanionWeapon(companion, getEffectiveWeapons())?.id
      : undefined);
  const weapon = weaponId
    ? moddedWeaponStats(weaponId, data.weaponMods ?? [], undefined, { companionMods: data.mods ?? [] })
    : null;
  const weaponName = weaponId ? getEffectiveWeaponsMap().get(weaponId)?.name ?? null : null;
  return { kind: "companion", label, body, weapon, weaponName };
}

function modularSnapshot(label: string, data: ModularBuildData): CompareSnapshot | null {
  const weapon = weaponFromModularData(data);
  if (!weapon) return null;
  const stats = moddedWeaponStats(weapon, data.mods ?? [], data.arcaneIds);
  if (!stats) return null;
  return { kind: "modular", label, stats };
}

function findArchwing(frameId: string) {
  const raw = String(frameId ?? "");
  const normalized = normalizeArchwingId(raw.toLowerCase().replace(/\s+/g, "_"));
  return getEffectiveArchwings().find(
    (a) =>
      a.name === raw ||
      a.id === raw ||
      a.id === normalized ||
      a.name === raw.replace(/^Odenata/i, "Odonata"),
  ) ?? null;
}

function archwingSnapshot(label: string, data: ArchwingBuildData): CompareSnapshot | null {
  const frameId = data.frameId ?? "";
  const mods = data.frameMods ?? [];
  const frame = data.mode === "necramech"
    ? (() => {
        const mech = getEffectiveNecramechs().find((n) => n.name === frameId || n.id === frameId);
        return mech ? calculateNecramechBuild(mech, mods) : null;
      })()
    : (() => {
        const wing = findArchwing(frameId);
        return wing ? calculateArchwingBuild(wing, mods) : null;
      })();
  if (!frame) return null;
  const weapon = data.weaponId ? moddedWeaponStats(data.weaponId, data.weaponMods ?? []) : null;
  const weaponName = data.weaponId ? getEffectiveWeaponsMap().get(data.weaponId)?.name ?? null : null;
  return { kind: "archwing", label, frame, weapon, weaponName };
}

export function snapshotFromBuild(
  type: string,
  label: string,
  data: unknown,
): CompareSnapshot | null {
  if (!data || typeof data !== "object") return null;
  if (type === "weapon") {
    const d = data as WeaponBuildData;
    if (!d.weaponId) return null;
    const entry = calcSavedWeaponBuildStats({
      weaponId: d.weaponId,
      mods: d.mods ?? [],
      arcaneIds: d.arcaneIds,
      progenitorElement: d.progenitorElement,
      progenitorBonusPercent: d.progenitorBonusPercent,
      incarnonEvolutions: d.incarnonEvolutions,
    });
    if (!entry) return null;
    return { kind: "weapon", label, stats: entry.stats };
  }
  if (type === "warframe") {
    const d = data as WarframeBuildData;
    if (!d.warframeId) return null;
    const preview = resolvePublicBuildWarframePreview(d);
    if (!preview) return null;
    return { kind: "warframe", label, stats: preview.stats };
  }
  if (type === "companion") return companionSnapshot(label, data as CompanionBuildData);
  if (type === "modular") return modularSnapshot(label, data as ModularBuildData);
  if (type === "archwing") return archwingSnapshot(label, data as ArchwingBuildData);
  return null;
}

export function buildItemId(type: CompareKind, data: unknown): string {
  return extractBuildItemId(type, data);
}
