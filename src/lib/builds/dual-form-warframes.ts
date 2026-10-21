import type { Ability, ModSlot, Warframe } from "@/lib/types";
import type { WarframeBuildData } from "@/lib/builds/build-storage";

export const EMPTY_ARCANE_IDS: (string | null)[] = [null, null];
export const DEFAULT_ARCANE_RANKS = [5, 5] as const;

export interface DualFormDef {
  id: string;
  label: string;
  /** Signature melee weapon id when this form is active (e.g. Pride / Wrath). */
  signatureMeleeId?: string;
  /**
   * Base (rank 0) stats when this form has its own stat block. The rank-30 values
   * live in the rank-30 tables under `<warframeId>#<formId>`.
   */
  baseStats?: Pick<Warframe, "health" | "shield" | "armor" | "energy" | "sprintSpeed">;
}

export interface DualFormWarframeConfig {
  /** Stored in `mods` / `slotPolarities` on save. */
  defaultFormId: string;
  forms: DualFormDef[];
}

/** Warframes that occupy one slot but have independent mod configurations per form. */
export const DUAL_FORM_WARFRAMES: Record<string, DualFormWarframeConfig> = {
  sirius_orion: {
    defaultFormId: "sirius",
    forms: [
      { id: "sirius", label: "Sirius", signatureMeleeId: "pride" },
      // wiki.warframe.com/w/Orion + WFCD OrionSuit: 350 HP / 270 SH / 300 AR / 200 EN, sprint 1.15.
      {
        id: "orion",
        label: "Orion",
        signatureMeleeId: "wrath",
        baseStats: { health: 350, shield: 270, armor: 300, energy: 200, sprintSpeed: 1.15 },
      },
    ],
  },
};

/**
 * The warframe record to calculate stats with for one form. Forms with their own
 * stat block get their base stats and a `statFormId`, so the rank-30 lookups use the
 * `<id>#<formId>` rows. Other forms (and non dual-form frames) return the input as-is.
 */
export function warframeForDualForm<T extends Warframe>(warframe: T, formId: string | undefined): T {
  if (!formId) return warframe;
  const form = getDualFormConfig(warframe.id)?.forms.find((f) => f.id === formId);
  if (!form?.baseStats) return warframe;
  return { ...warframe, ...form.baseStats, statFormId: formId };
}

/** Indices into `warframe.abilities` per form (slot 4 = shared ultimate). */
const DUAL_FORM_ABILITY_INDICES: Record<string, Record<string, number[]>> = {
  sirius_orion: {
    sirius: [0, 2, 4, 6],
    orion: [1, 3, 5, 6],
  },
};

export interface DualFormAbilityEntry {
  gameSlot: number;
  abilityIndex: number;
  ability: Ability;
  formLabel?: string;
}

export function getDualFormAbilities(
  warframeId: string,
  formId: string,
  abilities: Ability[],
): DualFormAbilityEntry[] | null {
  const config = getDualFormConfig(warframeId);
  const indices = DUAL_FORM_ABILITY_INDICES[warframeId]?.[formId];
  if (!config || !indices) return null;
  const formLabel = config.forms.find((f) => f.id === formId)?.label;
  return indices.map((abilityIndex, i) => ({
    gameSlot: i + 1,
    abilityIndex,
    ability: abilities[abilityIndex],
    formLabel: i < 3 ? formLabel : undefined,
  }));
}

/** Flatten dual-form or default ability list for builder UI cards. */
export function buildAbilityDisplayEntries(
  warframe: { id: string; abilities: Ability[] },
  dualFormActive: boolean,
  activeDualFormId: string,
): {
  key: string;
  ability: Ability;
  abilityIndex: number;
  gameSlot: number;
  formLabel?: string;
}[] {
  if (dualFormActive) {
    const entries = getDualFormAbilities(warframe.id, activeDualFormId, warframe.abilities);
    if (entries) {
      return entries.map((entry) => ({
        key: `${entry.abilityIndex}-${activeDualFormId}`,
        ability: entry.ability,
        abilityIndex: entry.abilityIndex,
        gameSlot: entry.gameSlot,
        formLabel: entry.formLabel,
      }));
    }
  }
  return warframe.abilities.map((ability, i) => ({
    key: String(i),
    ability,
    abilityIndex: i,
    gameSlot: i + 1,
    formLabel: undefined,
  }));
}

export function getDualFormConfig(warframeId: string): DualFormWarframeConfig | null {
  return DUAL_FORM_WARFRAMES[warframeId] ?? null;
}

export function isDualFormWarframe(warframeId: string): boolean {
  return warframeId in DUAL_FORM_WARFRAMES;
}

/** Per-form mod + arcane state. Archon shards stay on the top-level build (shared across forms). */
export interface DualFormBuildSlice {
  mods: ModSlot[];
  slotPolarities: Record<number, string>;
  arcaneIds: (string | null)[];
  arcaneRanks?: number[];
}

export function emptyDualFormBuilds(warframeId: string): Record<string, DualFormBuildSlice> | undefined {
  const config = getDualFormConfig(warframeId);
  if (!config) return undefined;
  const builds: Record<string, DualFormBuildSlice> = {};
  for (const form of config.forms) {
    if (form.id === config.defaultFormId) continue;
    builds[form.id] = {
      mods: [],
      slotPolarities: {},
      arcaneIds: [...EMPTY_ARCANE_IDS],
      arcaneRanks: [...DEFAULT_ARCANE_RANKS],
    };
  }
  return builds;
}

/** Reconstruct all form mod slices from persisted build data. */
export function dualFormStatesFromBuild(d: WarframeBuildData): Record<string, DualFormBuildSlice> | null {
  const config = getDualFormConfig(d.warframeId);
  if (!config) return null;
  const states: Record<string, DualFormBuildSlice> = {};
  for (const form of config.forms) {
    if (form.id === config.defaultFormId) {
      states[form.id] = {
        mods: d.mods ?? [],
        slotPolarities: d.slotPolarities ?? {},
        arcaneIds: d.arcaneIds ?? [...EMPTY_ARCANE_IDS],
        arcaneRanks: d.arcaneRanks ?? [...DEFAULT_ARCANE_RANKS],
      };
    } else {
      const slice = d.dualFormBuilds?.[form.id];
      states[form.id] = {
        mods: slice?.mods ?? [],
        slotPolarities: slice?.slotPolarities ?? {},
        arcaneIds: slice?.arcaneIds ?? [...EMPTY_ARCANE_IDS],
        arcaneRanks: slice?.arcaneRanks ?? [...DEFAULT_ARCANE_RANKS],
      };
    }
  }
  return states;
}

/** Merge live form states into WarframeBuildData fields (default form → top-level, others → dualFormBuilds). */
export function serializeDualFormBuilds(
  warframeId: string,
  formStates: Record<string, DualFormBuildSlice>,
): Pick<WarframeBuildData, "mods" | "slotPolarities" | "arcaneIds" | "arcaneRanks" | "dualFormBuilds"> {
  const config = getDualFormConfig(warframeId);
  if (!config) {
    const only = formStates.sirius ?? Object.values(formStates)[0] ?? {
      mods: [],
      slotPolarities: {},
      arcaneIds: [...EMPTY_ARCANE_IDS],
      arcaneRanks: [...DEFAULT_ARCANE_RANKS],
    };
    return {
      mods: only.mods,
      slotPolarities: only.slotPolarities,
      arcaneIds: only.arcaneIds ?? [...EMPTY_ARCANE_IDS],
      arcaneRanks: only.arcaneRanks,
    };
  }
  const defaultState = formStates[config.defaultFormId] ?? {
    mods: [],
    slotPolarities: {},
    arcaneIds: [...EMPTY_ARCANE_IDS],
    arcaneRanks: [...DEFAULT_ARCANE_RANKS],
  };
  const dualFormBuilds: Record<string, DualFormBuildSlice> = {};
  for (const form of config.forms) {
    if (form.id === config.defaultFormId) continue;
    const slice = formStates[form.id] ?? {
      mods: [],
      slotPolarities: {},
      arcaneIds: [...EMPTY_ARCANE_IDS],
      arcaneRanks: [...DEFAULT_ARCANE_RANKS],
    };
    dualFormBuilds[form.id] = {
      mods: slice.mods,
      slotPolarities: slice.slotPolarities,
      arcaneIds: slice.arcaneIds ?? [...EMPTY_ARCANE_IDS],
      arcaneRanks: slice.arcaneRanks ?? [...DEFAULT_ARCANE_RANKS],
    };
  }
  return {
    mods: defaultState.mods,
    slotPolarities: defaultState.slotPolarities,
    arcaneIds: defaultState.arcaneIds ?? [...EMPTY_ARCANE_IDS],
    arcaneRanks: defaultState.arcaneRanks,
    dualFormBuilds,
  };
}

/** All warframe mod slots across every form (for set-bonus linkage). */
export function allDualFormMods(build: NonNullable<WarframeBuildData>): ModSlot[] {
  const config = getDualFormConfig(build.warframeId);
  if (!config) return build.mods ?? [];
  const extra = Object.values(build.dualFormBuilds ?? {}).flatMap((s) => s.mods ?? []);
  return [...(build.mods ?? []), ...extra];
}

export function dualFormModCountSummary(build: NonNullable<WarframeBuildData>): string {
  const config = getDualFormConfig(build.warframeId);
  if (!config) {
    const n = build.mods?.length ?? 0;
    return `${n} mod${n === 1 ? "" : "s"} filled`;
  }
  const parts = config.forms.map((form) => {
    const n =
      form.id === config.defaultFormId
        ? (build.mods?.length ?? 0)
        : (build.dualFormBuilds?.[form.id]?.mods?.length ?? 0);
    return `${form.label} ${n}`;
  });
  return parts.join(" · ");
}
