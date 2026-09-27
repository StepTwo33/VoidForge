import {
  MOA_BASE_STATS,
  houndBrackets,
  houndCores,
  houndModels,
  houndStabilizers,
  moaBrackets,
  moaCores,
  moaGyros,
  moaModels,
  type ModularCompanionParts,
} from "@/data/companion-parts";
import { companionsMap } from "@/data/companions";
import type { Companion } from "@/lib/types";

export interface ResolvedCompanionParts {
  companionId: string;
  companion: Companion;
  health: number;
  shield: number;
  armor: number;
  weaponId?: string;
  /** Suggested default polarities for empty slots (Penjaga ×4 + optional extra). */
  defaultSlotPolarities: Record<number, string>;
  displayName: string;
  isGilded: boolean;
}

function pctMult(bonusPercent: number, gilded: boolean): number {
  const pct = gilded ? bonusPercent * 2 : bonusPercent;
  return 1 + pct / 100;
}

function roundStat(value: number): number {
  return Math.round(value);
}

function penjagaDefaults(extraPolarity?: string): Record<number, string> {
  const slots: Record<number, string> = {
    0: "penjaga",
    1: "penjaga",
    2: "penjaga",
    3: "penjaga",
  };
  if (extraPolarity) slots[4] = extraPolarity;
  return slots;
}

export function findMoaModel(id: string) {
  return moaModels.find((p) => p.id === id || p.companionId === id || p.name.toLowerCase() === id.toLowerCase());
}
export function findMoaCore(id: string) {
  return moaCores.find((p) => p.id === id || p.name.toLowerCase() === id.toLowerCase());
}
export function findMoaGyro(id: string) {
  return moaGyros.find((p) => p.id === id || p.name.toLowerCase() === id.toLowerCase());
}
export function findMoaBracket(id: string) {
  return moaBrackets.find((p) => p.id === id || p.name.toLowerCase() === id.toLowerCase());
}
export function findHoundModel(id: string) {
  return houndModels.find((p) => p.id === id || p.companionId === id || p.name.toLowerCase() === id.toLowerCase());
}
export function findHoundCore(id: string) {
  return houndCores.find((p) => p.id === id || p.name.toLowerCase() === id.toLowerCase());
}
export function findHoundBracket(id: string) {
  return houndBrackets.find((p) => p.id === id || p.name.toLowerCase() === id.toLowerCase());
}
export function findHoundStabilizer(id: string) {
  return houndStabilizers.find((p) => p.id === id || p.name.toLowerCase() === id.toLowerCase());
}

/** Resolve modular MOA/Hound parts into body stats + companion identity. */
export function resolveCompanionParts(parts: ModularCompanionParts): ResolvedCompanionParts | null {
  const isGilded = parts.isGilded !== false;

  if (parts.kind === "moa") {
    const model = findMoaModel(parts.model);
    const core = findMoaCore(parts.core);
    const gyro = parts.gyro ? findMoaGyro(parts.gyro) : undefined;
    const bracket = findMoaBracket(parts.bracket);
    if (!model || !core || !gyro || !bracket) return null;

    const companion = companionsMap.get(model.companionId);
    if (!companion) return null;

    const hMult = pctMult(core.healthBonus, isGilded) * pctMult(gyro.healthBonus, isGilded);
    const sMult = pctMult(core.shieldBonus, isGilded) * pctMult(gyro.shieldBonus, isGilded);
    const aMult = pctMult(core.armorBonus, isGilded) * pctMult(gyro.armorBonus, isGilded);

    return {
      companionId: model.companionId,
      companion,
      health: roundStat(MOA_BASE_STATS.health * hMult),
      shield: roundStat(MOA_BASE_STATS.shield * sMult),
      armor: roundStat(MOA_BASE_STATS.armor * aMult),
      defaultSlotPolarities: penjagaDefaults(bracket.extraPolarity),
      displayName: `${model.name} Moa`,
      isGilded,
    };
  }

  const model = findHoundModel(parts.model);
  const core = findHoundCore(parts.core);
  const bracket = findHoundBracket(parts.bracket);
  const stabilizer = parts.stabilizer ? findHoundStabilizer(parts.stabilizer) : undefined;
  if (!model || !core || !bracket || !stabilizer) return null;

  const companion = companionsMap.get(model.companionId);
  if (!companion) return null;

  return {
    companionId: model.companionId,
    companion,
    health: roundStat(core.health * pctMult(bracket.healthBonus, isGilded)),
    shield: roundStat(core.shield * pctMult(bracket.shieldBonus, isGilded)),
    armor: roundStat(core.armor * pctMult(bracket.armorBonus, isGilded)),
    weaponId: model.weaponId,
    defaultSlotPolarities: penjagaDefaults(stabilizer.extraPolarity),
    displayName: `${model.name} Hound`,
    isGilded,
  };
}

/** Overlay resolved part stats onto a catalog companion row. */
export function companionWithPartStats(
  base: Companion,
  parts?: ModularCompanionParts | null,
): Companion {
  if (!parts) return base;
  const resolved = resolveCompanionParts(parts);
  if (!resolved) return base;
  return {
    ...base,
    health: resolved.health,
    shield: resolved.shield,
    armor: resolved.armor,
  };
}

export function defaultPartsForCompanion(
  companion: Companion,
): ModularCompanionParts | undefined {
  if (companion.type === "moa") {
    const model = moaModels.find((m) => m.companionId === companion.id);
    if (!model) return undefined;
    return {
      kind: "moa",
      model: model.id,
      core: "moa_core_drex",
      gyro: "moa_gyro_trux",
      bracket: "moa_bracket_drimper",
      isGilded: true,
    };
  }
  if (companion.type === "hound") {
    const model = houndModels.find((m) => m.companionId === companion.id);
    if (!model) return undefined;
    return {
      kind: "hound",
      model: model.id,
      core: "hound_core_adlet",
      bracket: "hound_bracket_cela",
      stabilizer: "hound_stabilizer_frak",
      isGilded: true,
    };
  }
  return undefined;
}
