import { describe, expect, it } from "vitest";
import {
  compareSuggestionsEmptyCopy,
  compareTypeLabel,
  pickCompareSuggestions,
} from "./compare-suggestions";
import type { SavedBuild } from "./build-storage";

function mk(id: string, name: string, type = "weapon"): SavedBuild {
  return {
    id,
    name,
    type,
    isPublic: false,
    createdAt: 1,
    updatedAt: 1,
    data: {},
  };
}

describe("pickCompareSuggestions", () => {
  const builds = [mk("a", "A"), mk("b", "B"), mk("c", "C")];

  it("keeps newest-first order and honors the limit", () => {
    expect(pickCompareSuggestions(builds, { limit: 2 }).map((b) => b.id)).toEqual(["a", "b"]);
  });

  it("drops builds already on a compare side", () => {
    expect(pickCompareSuggestions(builds, { excludeIds: ["b", null] }).map((b) => b.id)).toEqual(["a", "c"]);
  });

  it("returns nothing when every build is already picked", () => {
    expect(pickCompareSuggestions(builds, { excludeIds: ["a", "b", "c"] })).toEqual([]);
  });
});

describe("compareSuggestionsEmptyCopy", () => {
  it("signed-in: prompts to save a matching-type build", () => {
    const copy = compareSuggestionsEmptyCopy({ signedIn: true, typeLabel: "weapon" });
    expect(copy.title).toMatch(/weapon/i);
    expect(copy.showSignIn).toBe(false);
    expect(copy.description).toMatch(/builder/i);
  });

  it("signed-out: prompts to sign in or save locally", () => {
    const copy = compareSuggestionsEmptyCopy({ signedIn: false, typeLabel: "warframe" });
    expect(copy.showSignIn).toBe(true);
    expect(copy.title).toMatch(/this device/i);
    expect(copy.description).toMatch(/sign in/i);
  });
});

describe("compareTypeLabel", () => {
  it("labels known compare kinds", () => {
    expect(compareTypeLabel("loadout")).toBe("loadout");
    expect(compareTypeLabel("modular")).toBe("modular");
  });
});
