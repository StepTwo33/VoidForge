import type ArsenalData from "@wfcd/arsenal-parser";
import type { ModUnion } from "@wfcd/items";
import type { Companion, Loadout, Mod, ModSlot, ModularBuildData } from "@/lib/types";
import { resolveCompanionClawId, resolveHoundWeaponId } from "@/lib/weapons/companion-weapons";
import { isAuraMod } from "@/lib/mods/aura-mods";
import { isWarframeExilusMod } from "@/lib/mods/mod-slot-categories";
import {
  findArcaneByName,
  findCompanionByName,
  findModByName,
  findWarframeByName,
  findWeaponByName,
  labelFromUnknown,
  parseCustomItemName,
} from "@/lib/warframe-arsenal/catalog-match";
import {
  findArchwingByLotusPath,
  findCompanionByLotusPath,
  findNecramechByLotusPath,
  findWarframeByLotusPath,
  findWeaponByLotusPath,
  lotusItemName,
  mapCompanionPartsFromArsenal,
  mapModularPartsFromArsenal,
  parseProgenitorFromRawWeapon,
  readAbilityOverride,
  readRawWeaponFields,
  resolveHelminthOverride,
} from "@/lib/warframe-arsenal/lotus-resolve";
import { resolveCompanionParts } from "@/lib/companions/companion-parts-resolve";
import { resolveRivenUpgrade } from "@/lib/warframe-arsenal/riven-resolve";

/** Warframe builder layout: 0=Aura, 1–8=regular, 9=Exilus. */
export const WARFRAME_IMPORT_AURA_SLOT = 0;
export const WARFRAME_IMPORT_EXILUS_SLOT = 9;
export const WARFRAME_IMPORT_REGULAR_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export interface ArsenalImportWarning {
  kind: "warframe" | "weapon" | "companion" | "mod" | "arcane" | "helminth" | "modular" | "archwing";
  label: string;
}

function toIsoTimestamp(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return new Date().toISOString();
}

export interface ArsenalImportPayload {
  account: {
    playerName: string;
    masteryRank: number;
    lastUpdated: string;
    focusSchool?: string;
  };
  loadout: Omit<Loadout, "id" | "createdAt" | "updatedAt">;
  warnings: ArsenalImportWarning[];
}

type RawSentinelSlot = {
  companion?: unknown;
  roboticweapon?: unknown;
  exalted?: unknown;
  exalted2?: unknown;
  exalted3?: unknown;
};

type RawLoadouts = {
  NORMAL?: {
    warframe?: unknown;
    primary?: unknown;
    secondary?: unknown;
    melee?: unknown;
    heavy?: unknown;
  };
  SENTINEL?: RawSentinelSlot;
};

const BEAST_COMPANION_TYPES = new Set(["kubrow", "kavat", "predasite", "vulpaphyla"]);

function rawUpgradesToModUnion(upgrades: unknown): ModUnion[] {
  if (!Array.isArray(upgrades)) return [];
  const out: ModUnion[] = [];
  for (const entry of upgrades) {
    if (!entry || typeof entry !== "object") continue;
    const rec = entry as { uniqueName?: string; rank?: number };
    if (!rec.uniqueName) continue;
    const rank = typeof rec.rank === "number" ? rec.rank : 0;
    const name = lotusItemName(rec.uniqueName);
    if (name) {
      out.push({ name, uniqueName: rec.uniqueName, rank } as unknown as ModUnion);
    } else {
      out.push({
        uniqueName: rec.uniqueName,
        rank,
        name: labelFromUnknown({ uniqueName: rec.uniqueName }),
      } as unknown as ModUnion);
    }
  }
  return out;
}

function pickRawCompanionWeapon(sentinel: RawSentinelSlot | undefined, companionType: string): unknown {
  if (!sentinel) return undefined;
  if (BEAST_COMPANION_TYPES.has(companionType)) {
    for (const key of ["exalted2", "exalted", "exalted3"] as const) {
      const candidate = sentinel[key];
      if (readRawWeaponFields(candidate).uniqueName) return candidate;
    }
  }
  return sentinel.roboticweapon;
}

function parsedWeaponUniqueName(weapon?: ArsenalWeapon): string | undefined {
  if (!weapon) return undefined;
  if (typeof weapon.uniqueName === "string") return weapon.uniqueName;
  const nested = weapon.weapon;
  if (nested && typeof nested === "object" && typeof (nested as { uniqueName?: string }).uniqueName === "string") {
    return (nested as { uniqueName: string }).uniqueName;
  }
  return undefined;
}

function mapCompanionWeaponMods(
  rawWeapon: unknown,
  parsedRoboticWeapon: ArsenalWeapon | undefined,
  warnings: ArsenalImportWarning[],
): ModSlot[] {
  const raw = readRawWeaponFields(rawWeapon);
  if (!raw.uniqueName && !raw.upgrades) return [];

  const parsedUnique = parsedWeaponUniqueName(parsedRoboticWeapon);
  if (
    parsedRoboticWeapon &&
    raw.uniqueName &&
    parsedUnique === raw.uniqueName &&
    parsedRoboticWeapon.upgrades?.mods?.length
  ) {
    return mapUpgradeMods(parsedRoboticWeapon.upgrades.mods, warnings, { keepStances: true }).mods;
  }

  return mapUpgradeMods(rawUpgradesToModUnion(raw.upgrades), warnings, { keepStances: true }).mods;
}

function resolveCompanionWeaponId(companion: Companion, weaponUniqueName?: string): string | undefined {
  const fromLotus = weaponUniqueName ? findWeaponByLotusPath(weaponUniqueName)?.id : undefined;
  if (fromLotus) return fromLotus;
  if (BEAST_COMPANION_TYPES.has(companion.type)) {
    return resolveCompanionClawId(companion);
  }
  if (companion.type === "hound") {
    return resolveHoundWeaponId(companion);
  }
  return undefined;
}

function modRank(mod: ModUnion): number {
  const rank = (mod as { rank?: number }).rank;
  return typeof rank === "number" ? rank : 0;
}

function normalizeCompanionLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

type ResolvedUpgradeMod = {
  modId: string;
  rank: number;
  fhMod?: Mod;
  rivenStats?: Record<string, number>;
};

function resolveUpgradeEntries(
  mods: ModUnion[],
  warnings: ArsenalImportWarning[],
  options?: { keepStances?: boolean },
): { entries: ResolvedUpgradeMod[]; stanceModId?: string } {
  const entries: ResolvedUpgradeMod[] = [];
  let stanceModId: string | undefined;

  for (const entry of mods) {
    const riven = resolveRivenUpgrade(entry);
    if (riven) {
      entries.push({
        modId: riven.modId,
        rank: riven.rank,
        ...(Object.keys(riven.rivenStats).length > 0 ? { rivenStats: riven.rivenStats } : {}),
      });
      continue;
    }

    const name = labelFromUnknown(entry);
    if (!name) continue;

    const fhMod = findModByName(name);
    if (!fhMod) {
      warnings.push({ kind: "mod", label: name });
      continue;
    }

    if (fhMod.category === "stance" && !options?.keepStances && !stanceModId) {
      stanceModId = fhMod.id;
      continue;
    }

    entries.push({
      modId: fhMod.id,
      rank: Math.min(modRank(entry), fhMod.maxRank),
      fhMod,
    });
  }

  return { entries, stanceModId };
}

function mapUpgradeMods(
  mods: ModUnion[],
  warnings: ArsenalImportWarning[],
  options?: { keepStances?: boolean },
): { mods: ModSlot[]; stanceModId?: string } {
  const { entries, stanceModId } = resolveUpgradeEntries(mods, warnings, options);
  const slots: ModSlot[] = entries.map((entry, slotIndex) => ({
    modId: entry.modId,
    rank: entry.rank,
    slotIndex,
    ...(entry.rivenStats ? { rivenStats: entry.rivenStats } : {}),
  }));
  return { mods: slots, stanceModId };
}

/**
 * Place warframe mods into builder slots by type (not arsenal list order).
 * Aura → 0, Exilus → 9, remaining fill 1–8. Extra exilus can sit in regular slots (in-game legal).
 */
export function mapWarframeUpgradeMods(
  mods: ModUnion[],
  warnings: ArsenalImportWarning[],
): { mods: ModSlot[] } {
  const { entries } = resolveUpgradeEntries(mods, warnings);

  let aura: ResolvedUpgradeMod | undefined;
  let exilus: ResolvedUpgradeMod | undefined;
  const regular: ResolvedUpgradeMod[] = [];

  for (const entry of entries) {
    const mod = entry.fhMod;
    if (mod && isAuraMod(mod)) {
      if (!aura) aura = entry;
      else warnings.push({ kind: "mod", label: `${mod.name} (extra aura skipped)` });
      continue;
    }
    if (mod && isWarframeExilusMod(mod)) {
      if (!exilus) {
        exilus = entry;
        continue;
      }
      // Second+ exilus mods may occupy regular slots.
      regular.push(entry);
      continue;
    }
    regular.push(entry);
  }

  const slots: ModSlot[] = [];
  const toSlot = (entry: ResolvedUpgradeMod, slotIndex: number): ModSlot => ({
    modId: entry.modId,
    rank: entry.rank,
    slotIndex,
    ...(entry.rivenStats ? { rivenStats: entry.rivenStats } : {}),
  });

  if (aura) slots.push(toSlot(aura, WARFRAME_IMPORT_AURA_SLOT));
  if (exilus) slots.push(toSlot(exilus, WARFRAME_IMPORT_EXILUS_SLOT));

  let regularCursor = 0;
  for (const entry of regular) {
    if (regularCursor >= WARFRAME_IMPORT_REGULAR_SLOTS.length) {
      warnings.push({ kind: "mod", label: `${entry.fhMod?.name ?? entry.modId} (no free regular slot)` });
      continue;
    }
    slots.push(toSlot(entry, WARFRAME_IMPORT_REGULAR_SLOTS[regularCursor]));
    regularCursor += 1;
  }

  return { mods: slots };
}

function mapArcaneIds(
  arcanes: Array<{ name?: string; rank?: number }>,
  warnings: ArsenalImportWarning[],
): { arcaneIds: (string | null)[]; arcaneRanks: number[] } {
  const arcaneIds: (string | null)[] = [null, null];
  const arcaneRanks: number[] = [0, 0];

  arcanes.slice(0, 2).forEach((arcane, index) => {
    const name = arcane.name;
    if (!name) return;
    const fh = findArcaneByName(name);
    if (!fh) {
      warnings.push({ kind: "arcane", label: name });
      return;
    }
    arcaneIds[index] = fh.id;
    const rank = typeof arcane.rank === "number" ? arcane.rank : fh.maxRank;
    arcaneRanks[index] = Math.min(rank, fh.maxRank);
  });

  return { arcaneIds, arcaneRanks };
}

type ArsenalWeapon = {
  name?: string;
  weapon?: unknown;
  parts?: Record<string, unknown>;
  upgrades: { mods: ModUnion[]; arcanes: Array<{ name?: string; rank?: number }> };
  xp?: number;
  uniqueName?: string;
};

function resolveWeaponId(
  weapon: ArsenalWeapon,
  raw?: ReturnType<typeof readRawWeaponFields>,
): { weaponId?: string; label: string; customName?: string } {
  const customName = raw?.itemName ? parseCustomItemName(raw.itemName) : undefined;

  const fromLotus = findWeaponByLotusPath(
    raw?.uniqueName ?? (typeof weapon.uniqueName === "string" ? weapon.uniqueName : undefined),
    raw?.itemName,
  );
  if (fromLotus) {
    return { weaponId: fromLotus.id, label: fromLotus.name, customName };
  }

  const label =
    customName ||
    weapon.name ||
    labelFromUnknown(weapon.weapon) ||
    labelFromUnknown(weapon) ||
    "Unknown weapon";
  const fh = findWeaponByName(label);
  return { weaponId: fh?.id, label, customName };
}

function weaponBuildFromArsenal(
  weapon: ArsenalWeapon | undefined,
  rawWeapon: unknown,
  warnings: ArsenalImportWarning[],
) {
  if (!weapon) return undefined;

  const raw = readRawWeaponFields(rawWeapon);
  const modularFromParts =
    mapModularPartsFromArsenal(weapon.parts) ??
    mapModularPartsFromArsenal(raw.modularParts);

  if (modularFromParts) {
    const { mods, stanceModId } = mapUpgradeMods(weapon.upgrades.mods, warnings);
    const { arcaneIds } = mapArcaneIds(weapon.upgrades.arcanes, warnings);
    const customName = raw.itemName ? parseCustomItemName(raw.itemName) : weapon.name;
    const build: ModularBuildData & { slot: "primary" | "secondary" | "melee" } = {
      ...modularFromParts.data,
      slot: modularFromParts.slot,
      mods,
      arcaneIds,
      customName: customName || undefined,
      isMR30: (weapon.xp ?? raw.xp ?? 0) >= 900_000,
    };
    if (stanceModId && modularFromParts.slot === "melee") {
      // Stance is tracked on melee weapon builds; modular zaws use stance in mods list.
    }
    return { kind: "modular" as const, build };
  }

  const { weaponId, label } = resolveWeaponId(weapon, raw);
  if (!weaponId) {
    warnings.push({ kind: "weapon", label });
    return undefined;
  }

  const { mods, stanceModId } = mapUpgradeMods(weapon.upgrades.mods, warnings);
  const { arcaneIds } = mapArcaneIds(weapon.upgrades.arcanes, warnings);
  const progenitor = parseProgenitorFromRawWeapon(raw);

  return {
    kind: "weapon" as const,
    build: {
      weaponId,
      mods,
      stanceModId,
      arcaneIds,
      hasOrokinCatalyst: false,
      isMR30: (weapon.xp ?? raw.xp ?? 0) >= 900_000,
      slotPolarities: {},
      ...progenitor,
    },
  };
}

function mapArchwingBuild(
  arsenal: ArsenalData,
  warnings: ArsenalImportWarning[],
): Loadout["archwingBuild"] {
  const vehicles = arsenal.loadout.vechiles;
  if (!vehicles) return undefined;

  if (vehicles.necramech?.mech) {
    const mech = vehicles.necramech.mech;
    const fhMech = findNecramechByLotusPath(mech.uniqueName);
    if (!fhMech) {
      warnings.push({ kind: "archwing", label: labelFromUnknown(mech.mech) ?? "Necramech" });
      return undefined;
    }

    const frameMods = mapUpgradeMods(mech.upgrades.mods, warnings).mods;
    const heavy = weaponBuildFromArsenal(vehicles.necramech.heavy, undefined, warnings);

    return {
      mode: "necramech",
      necramechId: fhMech.id,
      frameMods,
      weaponId: heavy?.kind === "weapon" ? heavy.build.weaponId : undefined,
      weaponMods: heavy?.kind === "weapon" ? heavy.build.mods : [],
      hasReactor: false,
      hasCatalyst: false,
    };
  }

  if (vehicles.archwing) {
    const aw = vehicles.archwing;
    const fhArch = findArchwingByLotusPath(aw.uniqueName) ?? findArchwingByLotusPath(labelFromUnknown(aw.archwing) ?? "");
    if (!fhArch) {
      warnings.push({ kind: "archwing", label: labelFromUnknown(aw.archwing) ?? "Archwing" });
      return undefined;
    }

    const frameMods = mapUpgradeMods(aw.upgrades.mods, warnings).mods;
    const gun =
      weaponBuildFromArsenal(vehicles.primary, undefined, warnings) ??
      weaponBuildFromArsenal(vehicles.melee, undefined, warnings);

    return {
      mode: "archwing",
      archwingId: fhArch.id,
      frameMods,
      weaponId: gun?.kind === "weapon" ? gun.build.weaponId : undefined,
      weaponMods: gun?.kind === "weapon" ? gun.build.mods : [],
      hasReactor: false,
      hasCatalyst: false,
    };
  }

  return undefined;
}

function assignWeaponSlot(
  loadout: Omit<Loadout, "id" | "createdAt" | "updatedAt">,
  slot: "primary" | "secondary" | "melee",
  mapped: ReturnType<typeof weaponBuildFromArsenal>,
) {
  if (!mapped) return;
  if (mapped.kind === "modular") {
    if (!loadout.modularBuild) {
      loadout.modularBuild = mapped.build;
    }
    return;
  }
  if (slot === "primary") loadout.primaryBuild = mapped.build;
  else if (slot === "secondary") loadout.secondaryBuild = mapped.build;
  else loadout.meleeBuild = mapped.build;
}

/** Map parsed Twitch arsenal data into a Voidforge loadout import payload. */
export function mapArsenalToImportPayload(
  arsenal: ArsenalData,
  rawPayload?: { loadOuts?: RawLoadouts },
): ArsenalImportPayload {
  const warnings: ArsenalImportWarning[] = [];
  const { loadout, account } = arsenal;
  const rawNormal = rawPayload?.loadOuts?.NORMAL;

  const wfLabel =
    labelFromUnknown(loadout.warframe.warframe) ||
    labelFromUnknown(loadout.warframe) ||
    "Warframe";
  const fhWarframe =
    findWarframeByLotusPath(loadout.warframe.uniqueName) ?? findWarframeByName(wfLabel);
  if (!fhWarframe) {
    warnings.push({ kind: "warframe", label: wfLabel });
  }

  const wfMapped = mapWarframeUpgradeMods(loadout.warframe.upgrades.mods, warnings);
  const wfArcanes = mapArcaneIds(loadout.warframe.upgrades.arcanes, warnings);

  const helminthOverride = readAbilityOverride(rawNormal?.warframe);
  const helminth = resolveHelminthOverride(helminthOverride);
  if (helminthOverride?.ability && !helminth) {
    warnings.push({
      kind: "helminth",
      label: helminthOverride.ability.split("/").pop() ?? "Helminth ability",
    });
  }

  let companionBuild: Loadout["companionBuild"];
  if (loadout.companion) {
    const sentinelRaw = rawPayload?.loadOuts?.SENTINEL;
    const rawCompanion = sentinelRaw?.companion;
    const rawFields = readRawWeaponFields(rawCompanion);
    const companionUniqueName =
      loadout.companion.uniqueName ?? rawFields.uniqueName;
    const companionItemName = rawFields.itemName;
    const petCustomName = companionItemName
      ? parseCustomItemName(companionItemName)
      : loadout.companion.name;

    const mappedParts = mapCompanionPartsFromArsenal(rawFields.modularParts);
    const partsResolved = mappedParts ? resolveCompanionParts(mappedParts) : undefined;

    let fhCompanion =
      findCompanionByLotusPath(companionUniqueName, companionItemName) ??
      findCompanionByName(
        labelFromUnknown(loadout.companion.companion) ||
          labelFromUnknown(loadout.companion) ||
          "Companion",
      );

    if (!fhCompanion && partsResolved) {
      fhCompanion = partsResolved.companion;
    }
    if (fhCompanion && partsResolved && partsResolved.companionId !== fhCompanion.id) {
      // Prefer modular model identity when parts fully resolve.
      fhCompanion = partsResolved.companion;
    }

    if (!fhCompanion) {
      warnings.push({
        kind: "companion",
        label: petCustomName || labelFromUnknown(loadout.companion.companion) || "Companion",
      });
    } else {
      const body = mapUpgradeMods(loadout.companion.upgrades.mods, warnings);
      const rawCompanionWeapon = pickRawCompanionWeapon(sentinelRaw, fhCompanion.type);
      const rawCompanionWeaponFields = readRawWeaponFields(rawCompanionWeapon);
      const weaponMods = mapCompanionWeaponMods(
        rawCompanionWeapon,
        loadout.roboticweapon,
        warnings,
      );
      const weaponId =
        resolveCompanionWeaponId(fhCompanion, rawCompanionWeaponFields.uniqueName) ??
        partsResolved?.weaponId;
      const companionArcanes = mapArcaneIds(loadout.companion.upgrades.arcanes, warnings);
      const catalogName = fhCompanion.name;
      const customName =
        petCustomName && normalizeCompanionLabel(petCustomName) !== normalizeCompanionLabel(catalogName)
          ? petCustomName
          : undefined;
      companionBuild = {
        companionId: fhCompanion.id,
        customName,
        mods: body.mods,
        weaponId,
        weaponMods,
        arcaneIds: companionArcanes.arcaneIds,
        hasReactor: false,
        hasCatalyst: false,
        isMR30: (loadout.companion.xp ?? 0) >= 900_000,
        ...(mappedParts ? { parts: mappedParts } : {}),
        ...(partsResolved?.defaultSlotPolarities
          ? { slotPolarities: partsResolved.defaultSlotPolarities }
          : {}),
      };
    }
  }

  const playerName = account.name;
  const loadoutName = `${playerName} — Imported Loadout`;

  const resultLoadout: Omit<Loadout, "id" | "createdAt" | "updatedAt"> = {
    name: loadoutName,
    warframeBuild: fhWarframe
      ? {
          warframeId: fhWarframe.id,
          mods: wfMapped.mods,
          shards: [null, null, null, null, null],
          arcaneIds: wfArcanes.arcaneIds,
          arcaneRanks: wfArcanes.arcaneRanks,
          hasOrokinReactor: false,
          isMR30: (loadout.warframe.xp ?? 0) >= 900_000,
          slotPolarities: {},
          ...(helminth
            ? { helminthSlot: helminth.helminthSlot, helminthAbilityId: helminth.helminthAbilityId }
            : {}),
        }
      : undefined,
    companionBuild,
  };

  assignWeaponSlot(
    resultLoadout,
    "primary",
    weaponBuildFromArsenal(loadout.primary, rawNormal?.primary, warnings),
  );
  assignWeaponSlot(
    resultLoadout,
    "secondary",
    weaponBuildFromArsenal(loadout.secondary, rawNormal?.secondary, warnings),
  );
  assignWeaponSlot(
    resultLoadout,
    "melee",
    weaponBuildFromArsenal(loadout.melee, rawNormal?.melee, warnings),
  );

  // Archgun (heavy) — import as primary when no primary is set.
  if (!resultLoadout.primaryBuild && !resultLoadout.modularBuild?.slot && loadout.heavy) {
    const heavyMapped = weaponBuildFromArsenal(loadout.heavy, rawNormal?.heavy, warnings);
    if (heavyMapped?.kind === "weapon") {
      resultLoadout.primaryBuild = heavyMapped.build;
    }
  }

  const archwingBuild = mapArchwingBuild(arsenal, warnings);
  if (archwingBuild) {
    resultLoadout.archwingBuild = archwingBuild;
  }

  return {
    account: {
      playerName,
      masteryRank: account.masteryRank,
      lastUpdated: toIsoTimestamp(account.lastUpdated),
      focusSchool: account.focusSchool,
    },
    loadout: resultLoadout,
    warnings,
  };
}

export function loadoutHasImportableContent(loadout: ArsenalImportPayload["loadout"]): boolean {
  return !!(
    loadout.warframeBuild ||
    loadout.primaryBuild ||
    loadout.secondaryBuild ||
    loadout.meleeBuild ||
    loadout.modularBuild ||
    loadout.companionBuild ||
    loadout.archwingBuild
  );
}
