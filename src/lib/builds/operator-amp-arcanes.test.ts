import { describe, expect, it } from "vitest";
import type { ModularBuildData } from "@/lib/types";
import {
  migrateOperatorAmpArcanes,
  modularAmpDivergesFromSaved,
  modularAmpSlotState,
  persistOperatorAmpArcanes,
  resolveAmpArcanes,
  writeAmpArcanesOnModular,
} from "./operator-amp-arcanes";

const amp = (arcanes?: { ids?: (string | null)[]; ranks?: number[] }): ModularBuildData => ({
  modularType: "amp",
  parts: { prism: "raplak_prism", scaffold: "propa_scaffold", brace: "certus_brace" },
  mods: [],
  hasOrokinCatalyst: false,
  ...(arcanes?.ids ? { arcaneIds: arcanes.ids, arcaneRanks: arcanes.ranks } : {}),
});

describe("operator amp arcanes (wiki: Virtuos/Eternal slot on the Amp)", () => {
  it("prefers arcanes stored on the modular amp", () => {
    const resolved = resolveAmpArcanes({
      ampModularBuild: amp({ ids: ["virtuos_shadow", null], ranks: [5, 5] }),
      ampArcaneIds: ["eternal_eradicate", "virtuos_tempo"],
      ampArcaneRanks: [3, 4],
    });
    expect(resolved.source).toBe("amp");
    expect(resolved.ids).toEqual(["virtuos_shadow", null]);
    expect(resolved.ranks[0]).toBe(5);
  });

  it("falls back to the legacy operator-build field when the amp has none", () => {
    const resolved = resolveAmpArcanes({
      ampModularBuild: amp(),
      ampArcaneIds: ["virtuos_fury", null],
      ampArcaneRanks: [4],
    });
    expect(resolved.source).toBe("legacy");
    expect(resolved.ids).toEqual(["virtuos_fury", null]);
    expect(resolved.ranks).toEqual([4, 5]);
  });

  it("migrates leftover operator-build amp arcanes onto the imported amp", () => {
    const migrated = migrateOperatorAmpArcanes({
      focusSchool: "Madurai",
      ampModularBuild: amp(),
      ampArcaneIds: ["virtuos_shadow", "eternal_onslaught"],
      ampArcaneRanks: [5, 3],
    });
    expect(migrated.ampModularBuild?.arcaneIds).toEqual(["virtuos_shadow", "eternal_onslaught"]);
    expect(migrated.ampModularBuild?.arcaneRanks).toEqual([5, 3]);
    expect(migrated.ampArcaneIds).toBeUndefined();
    expect(migrated.ampArcaneRanks).toBeUndefined();
  });

  it("does not overwrite arcanes already on the amp, and drops the stale legacy field", () => {
    const migrated = migrateOperatorAmpArcanes({
      ampModularBuild: amp({ ids: ["virtuos_tempo", null], ranks: [2, 5] }),
      ampArcaneIds: ["virtuos_fury", "virtuos_strike"],
      ampArcaneRanks: [5, 5],
    });
    expect(migrated.ampModularBuild?.arcaneIds).toEqual(["virtuos_tempo", null]);
    expect(migrated.ampArcaneIds).toBeUndefined();
  });

  it("leaves preset-amp operator builds on the legacy field (no modular amp to move onto)", () => {
    const ob = { ampId: "sirocco", ampArcaneIds: ["virtuos_null", null], ampArcaneRanks: [5, 5] };
    expect(migrateOperatorAmpArcanes(ob)).toEqual(ob);
  });

  it("persists edits onto the modular amp and omits the legacy field", () => {
    const out = persistOperatorAmpArcanes(amp(), ["virtuos_ghost", null], [4, 5]);
    expect(out.ampModularBuild?.arcaneIds).toEqual(["virtuos_ghost", null]);
    expect(out.ampArcaneIds).toBeUndefined();
    expect(writeAmpArcanesOnModular(amp(), ["virtuos_surge", "virtuos_spike"], [1, 2]).arcaneIds).toEqual([
      "virtuos_surge",
      "virtuos_spike",
    ]);
  });
});

describe("Amp arcanes stay on the operator build or loadout (not a shared library copy)", () => {
  it("persistOperatorAmpArcanes writes onto the operator's own modular copy, not a shared object", () => {
    const original: ModularBuildData = {
      modularType: "amp",
      parts: { prism: "raplak_prism", scaffold: "propa_scaffold", brace: "certus_brace" },
      mods: [],
      hasOrokinCatalyst: false,
      arcaneIds: ["virtuos_shadow", null],
      arcaneRanks: [5, 5],
    };
    const snapshot = structuredClone(original);
    const out = persistOperatorAmpArcanes(original, ["virtuos_fury", "eternal_eradicate"], [2, 1]);
    expect(out.ampModularBuild?.arcaneIds).toEqual(["virtuos_fury", "eternal_eradicate"]);
    expect(out.ampModularBuild?.arcaneRanks).toEqual([2, 1]);
    // The input object is not mutated; a loadout and a standalone build can keep different copies.
    expect(original).toEqual(snapshot);
    expect(original.arcaneIds).toEqual(["virtuos_shadow", null]);
  });

  it("finds the source Amp by id or a unique name+parts match (import pre-fill, not write-back)", async () => {
    const { findSourceModularAmp, modularAmpRefId } = await import("./operator-amp-arcanes");
    const saved = (id: string, name: string, data: ModularBuildData) => ({ id, name, type: "modular" as const, data });
    const amp = (ids?: (string | null)[]): ModularBuildData => ({
      modularType: "amp",
      parts: { prism: "raplak_prism", scaffold: "propa_scaffold", brace: "certus_brace" },
      mods: [],
      hasOrokinCatalyst: false,
      ...(ids ? { arcaneIds: ids, arcaneRanks: [5, 5] } : {}),
    });
    const lib = [saved("a1", "Terkeon Amp", amp(["virtuos_shadow", null])), saved("a2", "Other Amp", amp())];
    expect(findSourceModularAmp({ ampId: modularAmpRefId("a1"), ampModularBuild: amp() }, lib)?.id).toBe("a1");
    expect(findSourceModularAmp({ ampId: "sirocco", ampName: "Terkeon Amp", ampModularBuild: amp() }, lib)?.id).toBe("a1");
    expect(findSourceModularAmp({ ampModularBuild: amp() }, lib)).toBeNull();
  });
});

describe("Imported Amp dirty state (arcane edits vs the saved Amp)", () => {
  const savedAmp = (ids: (string | null)[] = [null, null], ranks: number[] = [5, 5]): ModularBuildData => ({
    modularType: "amp",
    parts: { prism: "raplak_prism", scaffold: "propa_scaffold", brace: "certus_brace" },
    mods: [],
    hasOrokinCatalyst: false,
    arcaneIds: ids,
    arcaneRanks: ranks,
  });

  it("is clean when arcanes and ranks still match the saved Amp", () => {
    const saved = savedAmp(["virtuos_shadow", null], [5, 5]);
    const current = writeAmpArcanesOnModular(saved, ["virtuos_shadow", null], [5, 5]);
    expect(modularAmpDivergesFromSaved(current, saved)).toBe(false);
    expect(modularAmpSlotState("modular_a1", "a1", current, saved)).toBe("active");
  });

  it("is dirty after an arcane is added, swapped, or ranked differently", () => {
    const saved = savedAmp(["virtuos_shadow", null], [5, 5]);
    expect(modularAmpDivergesFromSaved(writeAmpArcanesOnModular(saved, ["virtuos_fury", null], [5, 5]), saved)).toBe(true);
    expect(modularAmpDivergesFromSaved(writeAmpArcanesOnModular(saved, ["virtuos_shadow", "eternal_onslaught"], [5, 3]), saved)).toBe(true);
    expect(modularAmpDivergesFromSaved(writeAmpArcanesOnModular(saved, ["virtuos_shadow", null], [2, 5]), saved)).toBe(true);
    expect(modularAmpSlotState("modular_a1", "a1", writeAmpArcanesOnModular(saved, ["virtuos_fury", null], [5, 5]), saved)).toBe("modified");
  });

  it("is dirty when a saved arcane is removed, and clean again if edits are undone", () => {
    const saved = savedAmp(["virtuos_shadow", "eternal_onslaught"], [5, 3]);
    const cleared = writeAmpArcanesOnModular(saved, [null, null], [5, 5]);
    expect(modularAmpDivergesFromSaved(cleared, saved)).toBe(true);
    const restored = writeAmpArcanesOnModular(cleared, ["virtuos_shadow", "eternal_onslaught"], [5, 3]);
    expect(modularAmpDivergesFromSaved(restored, saved)).toBe(false);
  });

  it("treats vacant slots as matching even when padded ranks differ", () => {
    const saved: ModularBuildData = {
      modularType: "amp",
      parts: { prism: "raplak_prism", scaffold: "propa_scaffold", brace: "certus_brace" },
      mods: [],
      hasOrokinCatalyst: false,
    };
    const current = writeAmpArcanesOnModular(saved, [null, null], [5, 5]);
    expect(modularAmpDivergesFromSaved(current, saved)).toBe(false);
  });

  it("is idle when a different Amp is selected, and does not compare missing payloads", () => {
    const saved = savedAmp(["virtuos_shadow", null]);
    expect(modularAmpSlotState("modular_other", "a1", saved, saved)).toBe("idle");
    expect(modularAmpSlotState("modular_a1", "a1", null, saved)).toBe("active");
    expect(modularAmpDivergesFromSaved(null, saved)).toBe(false);
    expect(modularAmpDivergesFromSaved(saved, null)).toBe(false);
  });
});
