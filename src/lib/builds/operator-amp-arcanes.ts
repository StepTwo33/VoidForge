import type { ModularBuildData } from "@/lib/types";

/** Wiki: Operator Amps have two Arcane slots (second unlocked with an Amp Arcane Adapter). */
export const AMP_ARCANE_SLOTS = 2;

export type OperatorAmpArcaneFields = {
  ampModularBuild?: ModularBuildData | null;
  ampArcaneIds?: (string | null)[];
  ampArcaneRanks?: number[];
};

export type AmpArcaneSource = "amp" | "legacy" | "empty";

export function padArcaneSlots(
  ids: (string | null)[] | undefined,
  ranks: number[] | undefined,
  slots: number = AMP_ARCANE_SLOTS,
): { ids: (string | null)[]; ranks: number[] } {
  return {
    ids: Array.from({ length: slots }, (_, i) => ids?.[i] ?? null),
    ranks: Array.from({ length: slots }, (_, i) =>
      typeof ranks?.[i] === "number" && Number.isFinite(ranks[i]) ? ranks[i]! : 5,
    ),
  };
}

export function hasEquippedArcane(ids?: (string | null)[] | null): boolean {
  return (ids ?? []).some((id) => typeof id === "string" && id.length > 0);
}

/**
 * Amp Virtuos / Eternal arcanes live on the Amp (wiki Amp / Arcane Enhancement).
 * Prefer the modular amp payload; fall back to the legacy operator-build field.
 */
export function resolveAmpArcanes(ob: OperatorAmpArcaneFields): {
  ids: (string | null)[];
  ranks: number[];
  source: AmpArcaneSource;
} {
  const modular = ob.ampModularBuild ?? undefined;
  if (modular && hasEquippedArcane(modular.arcaneIds)) {
    return { ...padArcaneSlots(modular.arcaneIds, modular.arcaneRanks), source: "amp" };
  }
  if (hasEquippedArcane(ob.ampArcaneIds)) {
    return { ...padArcaneSlots(ob.ampArcaneIds, ob.ampArcaneRanks), source: "legacy" };
  }
  if (modular) {
    return { ...padArcaneSlots(modular.arcaneIds, modular.arcaneRanks), source: "amp" };
  }
  return { ...padArcaneSlots(ob.ampArcaneIds, ob.ampArcaneRanks), source: "empty" };
}

/** Write Virtuos / Eternal arcanes onto a modular amp (the single source of truth). */
export function writeAmpArcanesOnModular(
  modular: ModularBuildData,
  ids: (string | null)[],
  ranks: number[],
): ModularBuildData {
  const padded = padArcaneSlots(ids, ranks);
  return { ...modular, arcaneIds: padded.ids, arcaneRanks: padded.ranks };
}

/**
 * Move legacy `ampArcaneIds` onto an imported modular amp so they are not dropped.
 * If the amp already has arcanes, those win and the leftover operator-build field is cleared.
 */
export function migrateOperatorAmpArcanes<T extends OperatorAmpArcaneFields>(ob: T): T {
  const modular = ob.ampModularBuild;
  if (!modular) return ob;
  const modularHas = hasEquippedArcane(modular.arcaneIds);
  const legacyHas = hasEquippedArcane(ob.ampArcaneIds);
  if (!legacyHas) {
    if (ob.ampArcaneIds == null && ob.ampArcaneRanks == null) return ob;
    return { ...ob, ampArcaneIds: undefined, ampArcaneRanks: undefined };
  }
  if (modularHas) {
    return { ...ob, ampArcaneIds: undefined, ampArcaneRanks: undefined };
  }
  const padded = padArcaneSlots(ob.ampArcaneIds, ob.ampArcaneRanks);
  return {
    ...ob,
    ampModularBuild: writeAmpArcanesOnModular(modular, padded.ids, padded.ranks),
    ampArcaneIds: undefined,
    ampArcaneRanks: undefined,
  };
}

/** Payload to persist: arcanes on the amp when modular, otherwise on the operator build (preset amps). */
export function persistOperatorAmpArcanes(
  modular: ModularBuildData | null | undefined,
  ids: (string | null)[],
  ranks: number[],
): {
  ampModularBuild?: ModularBuildData;
  ampArcaneIds?: (string | null)[];
  ampArcaneRanks?: number[];
} {
  const padded = padArcaneSlots(ids, ranks);
  if (modular) {
    return {
      ampModularBuild: writeAmpArcanesOnModular(modular, padded.ids, padded.ranks),
    };
  }
  return {
    ampArcaneIds: padded.ids,
    ampArcaneRanks: padded.ranks,
  };
}
