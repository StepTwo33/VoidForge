/**
 * "Capacity may look over" notice for imported builds.
 *
 * A pasted mod list carries no Forma or slot polarities, so a build can land over capacity
 * (e.g. 90 / 48) purely because no slot is polarized yet. The notice is only armed by an import,
 * is dismissible, goes away as soon as the build fits, and never shows on hand-made builds.
 * Pure logic only; the builders feed it the capacity numbers they already compute.
 */

export interface CapacityFigures {
  used: number;
  max: number;
}

export interface ImportCapacityNoticeState {
  /** Item the last import went into (null = no import to explain). */
  armedFor: string | null;
  dismissed: boolean;
}

export type ImportCapacityNoticeEvent =
  | { type: "imported"; key: string }
  | { type: "dismiss" }
  /** Undo of the import, or any other reason the notice no longer applies. */
  | { type: "clear" }
  /** Sent after every render with the current item key and capacity. */
  | { type: "measure"; key: string; used: number; max: number };

export const INITIAL_IMPORT_CAPACITY_NOTICE: ImportCapacityNoticeState = { armedFor: null, dismissed: false };

export function isOverCapacity(used: number, max: number): boolean {
  return used > max;
}

export function importCapacityNoticeReducer(
  state: ImportCapacityNoticeState,
  event: ImportCapacityNoticeEvent,
): ImportCapacityNoticeState {
  switch (event.type) {
    case "imported":
      return { armedFor: event.key, dismissed: false };
    case "dismiss":
      return state.armedFor === null || state.dismissed ? state : { ...state, dismissed: true };
    case "clear":
      return state.armedFor === null ? state : INITIAL_IMPORT_CAPACITY_NOTICE;
    case "measure":
      // Different item, or the build now fits: the notice has done its job.
      if (state.armedFor === null) return state;
      if (state.armedFor !== event.key || !isOverCapacity(event.used, event.max)) return INITIAL_IMPORT_CAPACITY_NOTICE;
      return state;
  }
}

export function shouldShowImportCapacityNotice(
  state: ImportCapacityNoticeState,
  key: string,
  used: number,
  max: number,
): boolean {
  return state.armedFor === key && !state.dismissed && isOverCapacity(used, max);
}

export const IMPORT_CAPACITY_NOTICE_TITLE = "Capacity may look over after an import";

/** One paragraph, used in the builder notice and the import dialog. */
export function importCapacityNoticeText({ used, max }: CapacityFigures): string {
  return `This build shows ${used} / ${max}. Imports don't carry Forma or polarities, so capacity can look over until you set polarities and add Forma in the builder. The mods are all in place.`;
}

/** Same message for the import dialog, before the import is applied. */
export function importCapacityPreviewText({ used, max }: CapacityFigures): string {
  return `After this import the build would show ${used} / ${max}. Imports don't carry Forma or polarities, so capacity can look over until you set polarities and add Forma in the builder. The mods themselves import fine.`;
}

/** Shorter form for the confirmation toast. */
export function importCapacityToastText({ used, max }: CapacityFigures): string {
  return `Capacity shows ${used} / ${max} because imports don't carry Forma or polarities. Set them in the builder.`;
}
