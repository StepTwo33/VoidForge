import type { BaseArsenalData } from "@wfcd/arsenal-parser";
import ArsenalData from "@/lib/warframe-arsenal/vendor/arsenal-parser";

const EMPTY_LOADOUT_SECTION = Object.freeze({});

/**
 * @wfcd/arsenal-parser destructures ARCHWING, DATAKNIFE, OPERATOR, and SENTINEL
 * unconditionally. DE omits empty sections for some accounts, which crashes parsing.
 */
export function normalizeArsenalLoadOuts(loadOuts: unknown): Record<string, unknown> {
  if (!loadOuts || typeof loadOuts !== "object") {
    throw new Error("Missing loadOuts in arsenal payload.");
  }

  const src = loadOuts as Record<string, unknown>;
  const normalized: Record<string, unknown> = {
    NORMAL: src.NORMAL ?? EMPTY_LOADOUT_SECTION,
    ARCHWING: src.ARCHWING ?? EMPTY_LOADOUT_SECTION,
    DATAKNIFE: src.DATAKNIFE ?? EMPTY_LOADOUT_SECTION,
    OPERATOR: src.OPERATOR ?? EMPTY_LOADOUT_SECTION,
    SENTINEL: src.SENTINEL ?? EMPTY_LOADOUT_SECTION,
  };

  if (src.MECH !== undefined) normalized.MECH = src.MECH;
  if (src.RAILJACK !== undefined) normalized.RAILJACK = src.RAILJACK;

  return normalized;
}

export function prepareArsenalParserPayload(payload: Record<string, unknown>): BaseArsenalData {
  const normal = normalizeArsenalLoadOuts(payload.loadOuts).NORMAL;
  if (!normal || typeof normal !== "object") {
    throw new Error("Missing NORMAL loadout section.");
  }
  const warframe = (normal as Record<string, unknown>).warframe;
  if (!warframe || typeof warframe !== "object") {
    throw new Error("Missing warframe in NORMAL loadout section.");
  }

  return {
    ...payload,
    loadOuts: normalizeArsenalLoadOuts(payload.loadOuts),
  } as unknown as BaseArsenalData;
}

type ParserPayloadMutator = (payload: BaseArsenalData) => BaseArsenalData;

function withoutOptionalSections(
  payload: BaseArsenalData,
  keys: Array<"MECH" | "RAILJACK">,
): BaseArsenalData {
  const loadOuts = { ...(payload.loadOuts as unknown as Record<string, unknown>) };
  for (const key of keys) delete loadOuts[key];
  return { ...payload, loadOuts } as unknown as BaseArsenalData;
}

const PARSER_ATTEMPTS: ParserPayloadMutator[] = [
  (payload) => payload,
  (payload) => withoutOptionalSections(payload, ["RAILJACK"]),
  (payload) => withoutOptionalSections(payload, ["RAILJACK", "MECH"]),
];

/** Parse DE arsenal JSON with fallbacks for incomplete or malformed optional sections. */
export function buildArsenalData(payload: Record<string, unknown>): ArsenalData {
  const prepared = prepareArsenalParserPayload(payload);
  let lastError: unknown;

  for (const mutate of PARSER_ATTEMPTS) {
    try {
      return new ArsenalData(mutate(prepared));
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError instanceof Error) throw lastError;
  throw new Error("Failed to parse arsenal loadout data.");
}
