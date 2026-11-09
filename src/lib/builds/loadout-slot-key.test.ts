import { describe, expect, it } from "vitest";
import { loadoutSlotApplyKey } from "@/lib/builds/use-loadout-slot-from-url";

describe("loadout slot client navigation", () => {
  it("treats a different slot on the same loadout as a new apply", () => {
    expect(loadoutSlotApplyKey("loadout_1", "primary")).toBe("loadout_1:primary");
    expect(loadoutSlotApplyKey("loadout_1", "secondary")).not.toBe(
      loadoutSlotApplyKey("loadout_1", "primary"),
    );
    expect(loadoutSlotApplyKey(null, "primary")).toBeNull();
  });
});
