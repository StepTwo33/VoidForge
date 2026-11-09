import { describe, expect, it } from "vitest";
import {
  LOADOUT_ENEMY_HINT,
  LOADOUT_ENEMY_LABEL,
  PREVIEW_ENEMY_HINT,
  PREVIEW_ENEMY_LABEL,
} from "@/lib/ui/enemy-target-labels";

describe("enemy target labels", () => {
  it("names the loadout card and the public preview as separate targets", () => {
    expect(LOADOUT_ENEMY_LABEL).not.toBe(PREVIEW_ENEMY_LABEL);
    expect(LOADOUT_ENEMY_HINT).toContain("loadout");
    expect(PREVIEW_ENEMY_HINT).toContain("public");
  });
});
