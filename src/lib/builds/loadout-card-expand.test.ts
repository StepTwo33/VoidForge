import { describe, expect, it } from "vitest";
import { nextCombatOpen } from "@/lib/builds/loadout-card-expand";

describe("compact loadout cards", () => {
  it("expands one card without opening the others", () => {
    const opened = nextCombatOpen({}, "a");
    expect(opened.a).toBe(true);
    expect(opened.b).toBeUndefined();
    expect(nextCombatOpen(opened, "a").a).toBe(false);
  });
});
