import type { ArcaneEffectDef, ArcaneEffectLine } from "@/data/arcane-effects";
import {
  generateOverrideId,
  getOverrideForTarget,
  saveOverride,
} from "@/lib/overrides/data-overrides";

export interface ArcaneEffectLineDraft {
  stat: string;
  /** R0 value; undefined = legacy auto-scale from max only. */
  baseValue?: number;
  maxValue: number;
  /** When set, one value per rank (R0 = index 0). */
  valuesByRank?: number[];
  flat: boolean;
  stacking: boolean;
  constantAtAllRanks: boolean;
  /** UI: edit explicit per-rank table instead of base + max. */
  usePerRankValues?: boolean;
  /** Kept as-is (not edited in the dialog): max-rank-only / passive bonus metadata. */
  maxRankOnly?: boolean;
  passive?: boolean;
  maxRankText?: string;
}

export function toEffectDrafts(raw: unknown): ArcaneEffectLineDraft[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((line) => {
    const o = line as Record<string, unknown>;
    const valuesByRank = Array.isArray(o.valuesByRank)
      ? (o.valuesByRank as number[]).map(Number)
      : undefined;
    return {
      stat: String(o.stat ?? ""),
      baseValue: o.baseValue != null ? Number(o.baseValue) : undefined,
      maxValue: Number(o.maxValue ?? 0),
      valuesByRank,
      flat: Boolean(o.flat),
      stacking: Boolean(o.stacking),
      constantAtAllRanks: Boolean(o.constantAtAllRanks),
      usePerRankValues: Boolean(valuesByRank?.length),
      ...(o.maxRankOnly ? { maxRankOnly: true } : {}),
      ...(o.passive ? { passive: true } : {}),
      ...(typeof o.maxRankText === "string" ? { maxRankText: o.maxRankText } : {}),
    };
  });
}

export function draftToEffectLine(draft: ArcaneEffectLineDraft): ArcaneEffectLine {
  const line: ArcaneEffectLine = {
    stat: draft.stat,
    maxValue: draft.maxValue,
    ...(draft.flat ? { flat: true } : {}),
    ...(draft.stacking ? { stacking: true } : {}),
    ...(draft.constantAtAllRanks ? { constantAtAllRanks: true } : {}),
    ...(draft.maxRankOnly ? { maxRankOnly: true } : {}),
    ...(draft.passive ? { passive: true } : {}),
    ...(draft.maxRankText ? { maxRankText: draft.maxRankText } : {}),
  };
  if (draft.usePerRankValues && draft.valuesByRank?.length) {
    line.valuesByRank = [...draft.valuesByRank];
  } else if (draft.baseValue != null) {
    line.baseValue = draft.baseValue;
  }
  return line;
}

export function draftsToEffectsPayload(lines: ArcaneEffectLineDraft[]): ArcaneEffectLine[] {
  return lines.filter((l) => l.stat.trim()).map(draftToEffectLine);
}

/** Persist arcane build effect values (shared staff override). */
export async function saveArcaneEffectOverride(
  arcaneId: string,
  effectDef: ArcaneEffectDef,
  note = "",
): Promise<void> {
  const existing = getOverrideForTarget("arcane_effect", arcaneId);
  await saveOverride({
    id: existing?.id ?? generateOverrideId(),
    targetType: "arcane_effect",
    targetId: arcaneId,
    action: "modify",
    fields: effectDef as unknown as Record<string, unknown>,
    note,
    timestamp: Date.now(),
  });
}
