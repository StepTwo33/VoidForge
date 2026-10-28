/**
 * Round 23 housekeeping: the removed Volt "ReactivStorm" leftovers, and Repelling Bastille → Enduring Bastille.
 * Wiki: wiki.warframe.com/w/Enduring_Bastille, Update 41.1 (2026-02-11): "Augment - Repelling Bastille: Renamed
 * to Enduring Bastille" (Repelling Bastille redirects to it). Stats table: Added Bastille Duration 2s;
 * Added Vortex Duration 50/55/60/70% at R0–R3.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import { migrateRenamedMods } from "@/lib/mods/known-mods";

const card = (id: string, rank: number) =>
  getModStatDisplayLines(modsMap.get(id)!, rank).map((l) => l.atRank);

describe("Round 23 housekeeping", () => {
  it("no ReactivStorm / Volt Reactive Storm leftovers in the image map or the wiki meta", () => {
    expect(readFileSync("src/lib/display/images.ts", "utf8")).not.toContain("ReactivStorm");
    const meta = JSON.parse(readFileSync("scripts/_mod_wiki_meta.json", "utf8")) as Record<string, unknown>;
    expect(meta).not.toHaveProperty("augment_volt_reactive_storm");
    expect(meta).toHaveProperty("augment_baruuk_reactive_storm");
    expect(modsMap.has("augment_volt_reactive_storm")).toBe(false);
  });

  it("the catalog has one Bastille augment, named Enduring Bastille, with the wiki stat table", () => {
    const bastille = allMods.filter((m) => /Bastille/.test(m.name) && m.category === "augment");
    expect(bastille.map((m) => [m.id, m.name])).toEqual([["enduring_bastille", "Enduring Bastille"]]);
    expect(card("enduring_bastille", 0)).toEqual(["+2s Bastille Duration", "+50% Vortex Duration"]);
    expect(card("enduring_bastille", 1)).toEqual(["+2s Bastille Duration", "+55% Vortex Duration"]);
    expect(card("enduring_bastille", 2)).toEqual(["+2s Bastille Duration", "+60% Vortex Duration"]);
    expect(card("enduring_bastille", 3)).toEqual(["+2s Bastille Duration", "+70% Vortex Duration"]);
  });

  it("saved builds with the old id migrate (rank kept, name refreshed); a build with both keeps one", () => {
    const { mods, migrated } = migrateRenamedMods(
      [{ modId: "augment_vauban_repelling_bastille", rank: 3, slotIndex: 5 }],
      modsMap,
    );
    expect(mods).toEqual([{ modId: "enduring_bastille", rank: 3, slotIndex: 5 }]);
    expect(migrated).toEqual([
      { fromModId: "augment_vauban_repelling_bastille", toModId: "enduring_bastille", droppedAsDuplicate: false },
    ]);
    const both = migrateRenamedMods(
      [
        { modId: "enduring_bastille", rank: 2, slotIndex: 0 },
        { modId: "augment_vauban_repelling_bastille", rank: 3, slotIndex: 1 },
      ],
      modsMap,
    );
    expect(both.mods).toEqual([{ modId: "enduring_bastille", rank: 2, slotIndex: 0 }]);
  });
});
