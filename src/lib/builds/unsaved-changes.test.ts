import { describe, expect, it } from "vitest";
import { isBuildDirty, stableBuildSnapshot } from "./unsaved-changes";

describe("unsaved builder changes", () => {
  it("ignores key order and undefined fields", () => {
    const a = stableBuildSnapshot({ warframeId: "grendel", mods: [{ id: "a", rank: 3 }], extra: undefined });
    const b = stableBuildSnapshot({ mods: [{ rank: 3, id: "a" }], warframeId: "grendel" });
    expect(a).toBe(b);
    expect(isBuildDirty(a, b)).toBe(false);
  });
  it("detects a changed mod / slot order", () => {
    const a = stableBuildSnapshot({ mods: ["x", null, "y"] });
    const b = stableBuildSnapshot({ mods: ["y", null, "x"] });
    expect(isBuildDirty(a, b)).toBe(true);
  });
  it("empty builder is clean; a never-saved build is dirty", () => {
    expect(stableBuildSnapshot(null)).toBeNull();
    expect(isBuildDirty(null, null)).toBe(false);
    expect(isBuildDirty(stableBuildSnapshot({ warframeId: "grendel" }), null)).toBe(true);
  });
});
