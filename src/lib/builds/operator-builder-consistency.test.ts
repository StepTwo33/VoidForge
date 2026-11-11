import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { extractSlotData, resolveSlot } from "@/lib/builds/use-loadout-slot-from-url";
import { withLoadoutSlot } from "@/lib/builds/loadout-edit-context";
import type { Loadout } from "@/lib/types";

const page = readFileSync("src/app/operator-builder/page.tsx", "utf8");

const loadout: Loadout = {
  id: "l1",
  name: "Fix9",
  createdAt: 1,
  updatedAt: 1,
  operatorBuild: { focusSchool: "Madurai", ampId: "sirocco", ampName: "Sirocco", ampArcaneIds: ["virtuos_shadow", null], ampArcaneRanks: [5, 5] },
};

describe("operator builder matches the other builders (Terkeon reports)", () => {
  it("Save shows the same unsaved-changes highlight and dot as the other builders", () => {
    expect(page).toMatch(/useUnsavedChanges\(stableBuildSnapshot\(buildOperatorPayload\(\)\)\)/);
    expect(page).toMatch(/dirtyClass=\{SAVE_DIRTY_CLASS\}/);
    expect(page).toMatch(/dotClass=\{SAVE_DIRTY_DOT_CLASS\}/);
    expect(page).not.toMatch(/dirty && !loadout/);
  });

  it("opens a loadout slot through the shared ?loadout=&slot= hook", () => {
    expect(page).toMatch(/useLoadoutSlotFromUrl\("operator", handleLoadBuild\)/);
    expect(extractSlotData(loadout, "operator", "operator")).toBe(loadout.operatorBuild);
    expect(resolveSlot("operator", "operator", loadout.operatorBuild)).toBe("operator");
  });

  it("uses the shared builder header and save dialog instead of a separate Save to Loadout button", () => {
    expect(page).toMatch(/<BuilderItemHeader/);
    expect(page).toMatch(/<BuilderActionGroup>/);
    expect(page).not.toMatch(/PageHero/);
    expect(page).not.toMatch(/>\s*Save to Loadout\s*</);
    expect(page).toMatch(/loadoutTarget=\{loadoutCtx \?/);
  });

  it("saving to the loadout writes the operator slot", () => {
    const next = withLoadoutSlot(loadout, { loadoutId: "l1", loadoutName: "Fix9", kind: "operator", slot: "operator" }, {
      focusSchool: "Zenurik",
      ampId: "sirocco",
      ampName: "Sirocco",
    });
    expect(next.operatorBuild?.focusSchool).toBe("Zenurik");
  });

  it("writes edited Amp arcanes back onto the saved Modular Amp on save", () => {
    expect(page).toMatch(/ampArcaneWriteBack\(payload, modularSaved\)/);
    expect(page.match(/writeBackAmpArcanes\(payload\)/g)?.length).toBe(2);
  });
});
