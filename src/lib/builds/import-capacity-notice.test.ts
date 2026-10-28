import { describe, expect, it } from "vitest";
import {
  INITIAL_IMPORT_CAPACITY_NOTICE as INITIAL,
  importCapacityNoticeReducer as reduce,
  importCapacityNoticeText,
  importCapacityPreviewText,
  importCapacityToastText,
  shouldShowImportCapacityNotice as show,
} from "./import-capacity-notice";

describe("import capacity notice", () => {
  it("never shows on a hand-made build, even when it is over capacity", () => {
    expect(show(INITIAL, "banshee", 90, 48)).toBe(false);
    expect(reduce(INITIAL, { type: "measure", key: "banshee", used: 90, max: 48 })).toBe(INITIAL);
  });

  it("shows after an import that leaves the build over capacity", () => {
    const s = reduce(INITIAL, { type: "imported", key: "banshee" });
    expect(show(s, "banshee", 90, 48)).toBe(true);
    expect(reduce(s, { type: "measure", key: "banshee", used: 90, max: 48 })).toBe(s);
  });

  it("does not show when the imported build fits (exactly at capacity counts as fitting)", () => {
    const s = reduce(INITIAL, { type: "imported", key: "rifle" });
    expect(show(s, "rifle", 60, 60)).toBe(false);
    expect(show(s, "rifle", 41, 60)).toBe(false);
    expect(reduce(s, { type: "measure", key: "rifle", used: 60, max: 60 })).toEqual(INITIAL);
  });

  it("stays hidden once dismissed, and a new import shows it again", () => {
    let s = reduce(INITIAL, { type: "imported", key: "banshee" });
    s = reduce(s, { type: "dismiss" });
    expect(show(s, "banshee", 90, 48)).toBe(false);
    expect(reduce(s, { type: "measure", key: "banshee", used: 90, max: 48 })).toEqual(s);
    s = reduce(s, { type: "imported", key: "banshee" });
    expect(show(s, "banshee", 90, 48)).toBe(true);
  });

  it("goes away when the user fixes capacity, and does not come back if they go over again by hand", () => {
    let s = reduce(INITIAL, { type: "imported", key: "banshee" });
    s = reduce(s, { type: "measure", key: "banshee", used: 40, max: 48 });
    expect(show(s, "banshee", 40, 48)).toBe(false);
    s = reduce(s, { type: "measure", key: "banshee", used: 52, max: 48 });
    expect(show(s, "banshee", 52, 48)).toBe(false);
  });

  it("goes away on undo and when a different item is opened", () => {
    const armed = reduce(INITIAL, { type: "imported", key: "banshee" });
    expect(reduce(armed, { type: "clear" })).toEqual(INITIAL);
    expect(show(armed, "rhino", 90, 48)).toBe(false);
    expect(reduce(armed, { type: "measure", key: "rhino", used: 90, max: 48 })).toEqual(INITIAL);
  });

  it("explains the cause in plain words with the numbers", () => {
    const t = importCapacityNoticeText({ used: 90, max: 48 });
    expect(t).toContain("90 / 48");
    expect(t).toMatch(/Forma/);
    expect(t).toMatch(/polarities/);
    expect(importCapacityPreviewText({ used: 90, max: 48 })).toContain("would show 90 / 48");
    expect(importCapacityToastText({ used: 90, max: 48 })).toContain("90 / 48");
  });
});
