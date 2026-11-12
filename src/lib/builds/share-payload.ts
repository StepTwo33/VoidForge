/**
 * Convert saved builder payloads to / from ShareableBuild for compact share links.
 * Packing itself lives in build-url.ts so old packed links stay compatible.
 */

import type {
  ShareableAmpModular,
  ShareableBuild,
  ShareableCompanionParts,
  ShareableCrewSlot,
  ShareableCrewWeapon,
  ShareableRailjack,
  ShareableRivenRoll,
} from "@/lib/builds/build-url";
import type {
  ArchwingBuildData,
  CompanionBuildData,
  RailjackBuildData,
  SavedBuild,
} from "@/lib/builds/build-storage";
import type { LoadoutOperatorBuild, ModularBuildData, ModSlot } from "@/lib/types";

export const RAILJACK_SHARE_ITEM_ID = "railjack";

export function slotsToShareMods(slots: ModSlot[] | undefined): {
  mods: ShareableBuild["mods"];
  rivenBySlot?: Record<string, ShareableRivenRoll>;
} {
  const mods: ShareableBuild["mods"] = (slots ?? []).map((m) => ({
    id: m.modId,
    rank: m.rank,
    ...(m.slotIndex != null ? { slotIndex: m.slotIndex } : {}),
  }));
  const rivenBySlot: Record<string, ShareableRivenRoll> = {};
  for (const m of slots ?? []) {
    if (!m.rivenStats && !m.rivenPolarity && m.rivenDrain == null && !m.rivenName && !m.rivenId) {
      continue;
    }
    rivenBySlot[String(m.slotIndex)] = {
      stats: m.rivenStats ?? {},
      ...(m.rivenPolarity ? { polarity: m.rivenPolarity } : {}),
      ...(m.rivenDrain != null ? { drain: m.rivenDrain } : {}),
      ...(m.rivenName ? { name: m.rivenName } : {}),
      ...(m.rivenId ? { libraryId: m.rivenId } : {}),
    };
  }
  return { mods, rivenBySlot: Object.keys(rivenBySlot).length ? rivenBySlot : undefined };
}

export function shareModsToSlots(
  mods: ShareableBuild["mods"] | undefined,
  rivenBySlot?: Record<string, ShareableRivenRoll>,
): ModSlot[] {
  return (mods ?? []).map((m, i) => {
    const slot = m.slotIndex ?? i;
    const riven = rivenBySlot?.[String(slot)];
    const out: ModSlot = { modId: m.id, rank: m.rank, slotIndex: slot };
    if (riven) {
      if (riven.stats && Object.keys(riven.stats).length > 0) out.rivenStats = riven.stats;
      if (riven.polarity) out.rivenPolarity = riven.polarity;
      if (riven.drain != null) out.rivenDrain = riven.drain;
      if (riven.name) out.rivenName = riven.name;
      if (riven.libraryId) out.rivenId = riven.libraryId;
    }
    return out;
  });
}

export function polaritiesToShare(
  p?: Record<number | string, string>,
): Record<string, string> | undefined {
  if (!p) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v) out[String(k)] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

export function sharePolaritiesToRecord(p?: Record<string, string>): Record<number, string> {
  const out: Record<number, string> = {};
  if (!p) return out;
  for (const [k, v] of Object.entries(p)) {
    if (v) out[Number(k)] = v;
  }
  return out;
}

function arcanesToShare(ids?: (string | null)[]): string[] | undefined {
  if (!ids || ids.length === 0) return undefined;
  return ids.map((id) => id ?? "");
}

function shareArcanesToIds(ids?: string[]): (string | null)[] | undefined {
  if (!ids) return undefined;
  return ids.map((id) => (id ? id : null));
}

function modularPrimaryId(parts?: Record<string, string>, modularType?: string): string {
  if (!parts) return modularType || "modular";
  return parts.chamber || parts.strike || parts.prism || modularType || "modular";
}

export function companionBuildToShare(data: CompanionBuildData): ShareableBuild {
  const body = slotsToShareMods(data.mods);
  const weapon = slotsToShareMods(data.weaponMods);
  const parts = data.parts
    ? ({
        kind: data.parts.kind,
        model: data.parts.model,
        core: data.parts.core,
        bracket: data.parts.bracket,
        ...(data.parts.gyro ? { gyro: data.parts.gyro } : {}),
        ...(data.parts.stabilizer ? { stabilizer: data.parts.stabilizer } : {}),
        ...(data.parts.isGilded != null ? { isGilded: data.parts.isGilded } : {}),
      } satisfies ShareableCompanionParts)
    : undefined;
  return {
    type: "companion",
    itemId: data.companionId,
    mods: body.mods,
    rivenBySlot: body.rivenBySlot,
    arcanes: arcanesToShare(data.arcaneIds),
    hasOrokinReactor: data.hasReactor || undefined,
    hasOrokinCatalyst: data.hasCatalyst || undefined,
    isMR30: data.isMR30 || undefined,
    slotPolarities: polaritiesToShare(data.slotPolarities),
    weaponId: data.weaponId,
    weaponMods: weapon.mods.length ? weapon.mods : undefined,
    weaponSlotPolarities: polaritiesToShare(data.weaponSlotPolarities),
    weaponRivenBySlot: weapon.rivenBySlot,
    companionParts: parts,
    customName: data.customName,
  };
}

export function companionShareToBuild(shared: ShareableBuild): CompanionBuildData | null {
  if (shared.type !== "companion" || !shared.itemId) return null;
  const parts = shared.companionParts;
  return {
    companionId: shared.itemId,
    mods: shareModsToSlots(shared.mods, shared.rivenBySlot),
    weaponId: shared.weaponId,
    weaponMods: shareModsToSlots(shared.weaponMods, shared.weaponRivenBySlot),
    weaponSlotPolarities: sharePolaritiesToRecord(shared.weaponSlotPolarities),
    arcaneIds: shareArcanesToIds(shared.arcanes) ?? [],
    hasReactor: !!shared.hasOrokinReactor,
    hasCatalyst: !!shared.hasOrokinCatalyst,
    isMR30: !!shared.isMR30,
    slotPolarities: sharePolaritiesToRecord(shared.slotPolarities),
    ...(shared.customName ? { customName: shared.customName } : {}),
    ...(parts
      ? {
          parts: {
            kind: parts.kind === "hound" ? "hound" : "moa",
            model: parts.model,
            core: parts.core,
            bracket: parts.bracket,
            ...(parts.gyro ? { gyro: parts.gyro } : {}),
            ...(parts.stabilizer ? { stabilizer: parts.stabilizer } : {}),
            ...(parts.isGilded != null ? { isGilded: parts.isGilded } : {}),
          },
        }
      : {}),
  };
}

export function modularBuildToShare(data: ModularBuildData): ShareableBuild {
  const body = slotsToShareMods(data.mods);
  return {
    type: "modular",
    itemId: modularPrimaryId(data.parts, data.modularType),
    mods: body.mods,
    rivenBySlot: body.rivenBySlot,
    modularType: data.modularType,
    parts: data.parts,
    arcanes: arcanesToShare(data.arcaneIds),
    arcaneRanks: data.arcaneRanks,
    hasOrokinCatalyst: data.hasOrokinCatalyst || undefined,
    isMR30: data.isMR30 || undefined,
    slotPolarities: polaritiesToShare(data.slotPolarities),
    customName: data.customName,
  };
}

export function modularShareToBuild(shared: ShareableBuild): ModularBuildData | null {
  if (shared.type !== "modular") return null;
  return {
    modularType: shared.modularType || "kitgun",
    parts: shared.parts ?? {},
    mods: shareModsToSlots(shared.mods, shared.rivenBySlot),
    arcaneIds: shareArcanesToIds(shared.arcanes),
    arcaneRanks: shared.arcaneRanks,
    hasOrokinCatalyst: !!shared.hasOrokinCatalyst,
    isMR30: !!shared.isMR30,
    slotPolarities: sharePolaritiesToRecord(shared.slotPolarities),
    ...(shared.customName ? { customName: shared.customName } : {}),
  };
}

export function archwingBuildToShare(data: ArchwingBuildData): ShareableBuild {
  const frame = slotsToShareMods(data.frameMods);
  const weapon = slotsToShareMods(data.weaponMods);
  const exalted = data.exaltedWeaponMods
    ? slotsToShareMods(data.exaltedWeaponMods)
    : undefined;
  return {
    type: "archwing",
    itemId: data.frameId || "archwing",
    mods: frame.mods,
    rivenBySlot: frame.rivenBySlot,
    archwingMode: data.mode,
    hasOrokinReactor: data.hasReactor || undefined,
    hasOrokinCatalyst: data.hasCatalyst || undefined,
    isMR30: data.isMR30 || undefined,
    slotPolarities: polaritiesToShare(data.framePolarities),
    weaponId: data.weaponId,
    weaponMods: weapon.mods.length ? weapon.mods : undefined,
    weaponSlotPolarities: polaritiesToShare(data.weaponPolarities),
    weaponRivenBySlot: weapon.rivenBySlot,
    railjackGunnery: data.railjackGunnery,
    ...(exalted
      ? {
          exalted: {
            mods: exalted.mods,
            slotPolarities: polaritiesToShare(data.exaltedWeaponPolarities),
          },
        }
      : {}),
  };
}

export function archwingShareToBuild(shared: ShareableBuild): ArchwingBuildData | null {
  if (shared.type !== "archwing") return null;
  const exaltedMods = shared.exalted
    ? shareModsToSlots(shared.exalted.mods)
    : undefined;
  return {
    mode: shared.archwingMode || "archwing",
    frameId: shared.itemId === "archwing" ? undefined : shared.itemId,
    frameMods: shareModsToSlots(shared.mods, shared.rivenBySlot),
    weaponId: shared.weaponId,
    weaponMods: shareModsToSlots(shared.weaponMods, shared.weaponRivenBySlot),
    hasReactor: !!shared.hasOrokinReactor,
    hasCatalyst: !!shared.hasOrokinCatalyst,
    isMR30: !!shared.isMR30,
    framePolarities: sharePolaritiesToRecord(shared.slotPolarities),
    weaponPolarities: sharePolaritiesToRecord(shared.weaponSlotPolarities),
    ...(shared.railjackGunnery != null ? { railjackGunnery: shared.railjackGunnery } : {}),
    ...(exaltedMods
      ? {
          exaltedWeaponMods: exaltedMods,
          exaltedWeaponPolarities: sharePolaritiesToRecord(shared.exalted?.slotPolarities),
        }
      : {}),
  };
}

function crewWeaponToShare(
  loadout: NonNullable<
    NonNullable<NonNullable<RailjackBuildData["crewSlots"]>[number]>
  >["weaponLoadout"],
): ShareableCrewWeapon | undefined {
  if (!loadout?.weaponId) return undefined;
  const body = slotsToShareMods(loadout.mods);
  return {
    weaponId: loadout.weaponId,
    mods: body.mods,
    rivenBySlot: body.rivenBySlot,
    slotPolarities: polaritiesToShare(loadout.slotPolarities),
    hasOrokinCatalyst: loadout.hasOrokinCatalyst || undefined,
    progenitorElement: loadout.progenitorElement,
    progenitorBonusPercent: loadout.progenitorBonusPercent,
  };
}

function shareCrewWeaponToLoadout(
  w: ShareableCrewWeapon,
): NonNullable<NonNullable<NonNullable<RailjackBuildData["crewSlots"]>[number]>>["weaponLoadout"] {
  return {
    weaponId: w.weaponId,
    mods: shareModsToSlots(w.mods, w.rivenBySlot),
    slotPolarities: sharePolaritiesToRecord(w.slotPolarities),
    ...(w.hasOrokinCatalyst ? { hasOrokinCatalyst: true } : {}),
    ...(w.progenitorElement ? { progenitorElement: w.progenitorElement } : {}),
    ...(w.progenitorBonusPercent != null ? { progenitorBonusPercent: w.progenitorBonusPercent } : {}),
  };
}

const CREW_ROLES = new Set(["pilot", "gunner", "engineer", "defender"]);
const CREW_SOURCES = new Set(["ticker", "elite", "adversary"]);

function crewSlotToShare(
  slot: NonNullable<RailjackBuildData["crewSlots"]>[number],
): ShareableCrewSlot | null {
  if (!slot) return null;
  return {
    role: slot.role,
    source: slot.source,
    profileId: slot.profileId,
    competency: slot.competency
      ? {
          piloting: slot.competency.piloting,
          gunnery: slot.competency.gunnery,
          repair: slot.competency.repair,
          combat: slot.competency.combat,
          endurance: slot.competency.endurance,
        }
      : undefined,
    eliteTraitId: slot.eliteTraitId,
    weaponLoadout: crewWeaponToShare(slot.weaponLoadout),
  };
}

function shareCrewSlotToData(
  slot: ShareableCrewSlot | null,
): NonNullable<RailjackBuildData["crewSlots"]>[number] {
  if (!slot) return null;
  const role = CREW_ROLES.has(slot.role)
    ? (slot.role as NonNullable<NonNullable<RailjackBuildData["crewSlots"]>[number]> extends infer T
        ? T extends { role: infer R }
          ? R
          : never
        : never)
    : "pilot";
  const source = CREW_SOURCES.has(slot.source)
    ? (slot.source as "ticker" | "elite" | "adversary")
    : "ticker";
  const competency = slot.competency
    ? {
        piloting: slot.competency.piloting ?? 0,
        gunnery: slot.competency.gunnery ?? 0,
        repair: slot.competency.repair ?? 0,
        combat: slot.competency.combat ?? 0,
        endurance: slot.competency.endurance ?? 0,
      }
    : undefined;
  return {
    role: role as "pilot" | "gunner" | "engineer" | "defender",
    source,
    profileId: slot.profileId,
    ...(competency ? { competency } : {}),
    ...(slot.eliteTraitId ? { eliteTraitId: slot.eliteTraitId } : {}),
    ...(slot.weaponLoadout ? { weaponLoadout: shareCrewWeaponToLoadout(slot.weaponLoadout) } : {}),
  };
}

export function railjackBuildToShare(data: RailjackBuildData): ShareableBuild {
  const integrated = slotsToShareMods(data.integratedMods);
  const battle = slotsToShareMods(data.battleMods);
  const tactical = slotsToShareMods(data.tacticalMods);
  // Plexus rivens aren't a thing; if any riven extras appear they're still packed on each tab.
  const railjack: ShareableRailjack = {
    reactorId: data.reactorId,
    shieldId: data.shieldId,
    engineId: data.engineId,
    platingId: data.platingId,
    reactorTraitId: data.reactorTraitId,
    shieldTraitId: data.shieldTraitId,
    engineTraitId: data.engineTraitId,
    turretIds: data.turretIds?.map((id) => id ?? null),
    turretId: data.turretId,
    ordnanceId: data.ordnanceId,
    battleMods: battle.mods.length ? battle.mods : undefined,
    tacticalMods: tactical.mods.length ? tactical.mods : undefined,
    integratedPolarities: polaritiesToShare(data.integratedPolarities),
    battlePolarities: polaritiesToShare(data.battlePolarities),
    tacticalPolarities: polaritiesToShare(data.tacticalPolarities),
    crewSlots: data.crewSlots?.map(crewSlotToShare),
    eliteCrewId: data.eliteCrewId,
    intrinsics: data.intrinsics
      ? {
          tactical: data.intrinsics.tactical ?? 0,
          piloting: data.intrinsics.piloting ?? 0,
          gunnery: data.intrinsics.gunnery ?? 0,
          engineering: data.intrinsics.engineering ?? 0,
          command: data.intrinsics.command ?? 0,
        }
      : undefined,
    simulation: data.simulation,
  };
  return {
    type: "railjack",
    itemId: RAILJACK_SHARE_ITEM_ID,
    mods: integrated.mods,
    rivenBySlot: integrated.rivenBySlot,
    slotPolarities: polaritiesToShare(data.integratedPolarities),
    railjack,
  };
}

export function railjackShareToBuild(shared: ShareableBuild): RailjackBuildData | null {
  if (shared.type !== "railjack") return null;
  const rj = shared.railjack;
  return {
    reactorId: rj?.reactorId,
    shieldId: rj?.shieldId,
    engineId: rj?.engineId,
    platingId: rj?.platingId,
    reactorTraitId: rj?.reactorTraitId,
    shieldTraitId: rj?.shieldTraitId,
    engineTraitId: rj?.engineTraitId,
    turretIds: rj?.turretIds?.map((id) => id ?? undefined) ?? (rj?.turretId ? [rj.turretId, undefined] : undefined),
    turretId: rj?.turretId,
    ordnanceId: rj?.ordnanceId,
    integratedMods: shareModsToSlots(shared.mods, shared.rivenBySlot),
    battleMods: shareModsToSlots(rj?.battleMods),
    tacticalMods: shareModsToSlots(rj?.tacticalMods),
    integratedPolarities: sharePolaritiesToRecord(rj?.integratedPolarities ?? shared.slotPolarities),
    battlePolarities: sharePolaritiesToRecord(rj?.battlePolarities),
    tacticalPolarities: sharePolaritiesToRecord(rj?.tacticalPolarities),
    crewSlots: rj?.crewSlots?.map(shareCrewSlotToData),
    eliteCrewId: rj?.eliteCrewId,
    intrinsics: rj?.intrinsics
      ? {
          tactical: rj.intrinsics.tactical ?? 0,
          piloting: rj.intrinsics.piloting ?? 0,
          gunnery: rj.intrinsics.gunnery ?? 0,
          engineering: rj.intrinsics.engineering ?? 0,
          command: rj.intrinsics.command ?? 0,
        }
      : undefined,
    simulation: rj?.simulation,
  };
}

function modularDataToAmpSlice(data: ModularBuildData): ShareableAmpModular {
  const body = slotsToShareMods(data.mods);
  return {
    modularType: data.modularType,
    parts: data.parts,
    mods: body.mods,
    rivenBySlot: body.rivenBySlot,
    arcanes: arcanesToShare(data.arcaneIds),
    arcaneRanks: data.arcaneRanks,
    hasOrokinCatalyst: data.hasOrokinCatalyst || undefined,
    slotPolarities: polaritiesToShare(data.slotPolarities),
  };
}

function ampSliceToModularData(slice: ShareableAmpModular): ModularBuildData {
  return {
    modularType: slice.modularType || "amp",
    parts: slice.parts ?? {},
    mods: shareModsToSlots(slice.mods, slice.rivenBySlot),
    arcaneIds: shareArcanesToIds(slice.arcanes),
    arcaneRanks: slice.arcaneRanks,
    hasOrokinCatalyst: !!slice.hasOrokinCatalyst,
    slotPolarities: sharePolaritiesToRecord(slice.slotPolarities),
  };
}

export function operatorBuildToShare(data: LoadoutOperatorBuild): ShareableBuild {
  return {
    type: "operator",
    itemId: data.focusSchool || data.ampId || "operator",
    mods: [],
    focusSchool: data.focusSchool,
    ampId: data.ampId,
    ampName: data.ampName,
    operatorArcanes: arcanesToShare(data.arcaneIds),
    operatorArcaneRanks: data.arcaneRanks,
    ampArcaneIds: arcanesToShare(data.ampArcaneIds),
    ampArcaneRanks: data.ampArcaneRanks,
    ampModular: data.ampModularBuild ? modularDataToAmpSlice(data.ampModularBuild) : undefined,
  };
}

export function operatorShareToBuild(shared: ShareableBuild): LoadoutOperatorBuild | null {
  if (shared.type !== "operator") return null;
  return {
    focusSchool: shared.focusSchool || shared.itemId || "Madurai",
    arcaneIds: shareArcanesToIds(shared.operatorArcanes),
    arcaneRanks: shared.operatorArcaneRanks,
    ampId: shared.ampId,
    ampName: shared.ampName,
    ampArcaneIds: shareArcanesToIds(shared.ampArcaneIds),
    ampArcaneRanks: shared.ampArcaneRanks,
    ampModularBuild: shared.ampModular ? ampSliceToModularData(shared.ampModular) : undefined,
  };
}

/** Wrap a decoded share as a SavedBuild so existing handleLoadBuild can apply it. */
export function savedBuildFromShare(
  type: SavedBuild["type"],
  data: unknown,
  name = "Shared build",
): SavedBuild {
  return {
    id: "",
    name,
    type,
    createdAt: 0,
    updatedAt: 0,
    data,
  };
}
