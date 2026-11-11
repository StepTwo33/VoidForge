import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allArcanes } from "@/data/arcanes";
import { buildKitgun, buildZaw, kitgunChambers, kitgunGrips, kitgunLoaders, zawGrips, zawLinks, zawStrikes, ampPrisms } from "@/data/modular-weapons";
import { keepLegalModularBuild } from "./modular-part-edit";

const modsMap = new Map(allMods.map((m) => [m.id, m]));
const arc = (id: string) => allArcanes.find((a) => a.id === id)!;
const chamber = (id: string) => kitgunChambers.find((c) => c.id === id)!;
const grip = (id: string) => kitgunGrips.find((g) => g.id === id)!;
const loader = (id: string) => kitgunLoaders.find((l) => l.id === id)!;

describe("modular part edits keep the build (Terkeon report)", () => {
  const base = {
    rivenStats: {},
    slotPolarities: { 0: "madurai" },
    modsMap,
    rivenWeaponChanged: false,
  };

  it("keeps every mod and arcane when a kitgun loader changes in the same slot", () => {
    const weapon = buildKitgun(chamber("catchmoon_chamber"), grip("grip_gibber"), loader("loader_zip"));
    const mods = [{ modId: "hornet_strike_r3", slotIndex: 0 }, { modId: "suppress_r3", slotIndex: 8 }];
    const out = keepLegalModularBuild({
      ...base,
      weapon,
      modularType: "kitgun",
      mods,
      arcanes: [arc("arcane_secondary_merciless"), arc("pax_bolt")],
      arcaneRanks: [5, 3],
    });
    expect(out.dropped).toEqual([]);
    expect(out.mods).toEqual(mods);
    expect(out.arcanes.map((a) => a?.id)).toEqual(["arcane_secondary_merciless", "pax_bolt"]);
    expect(out.arcaneRanks).toEqual([5, 3]);
  });

  it("drops pistol mods and the secondary arcane when the grip makes it a primary", () => {
    const weapon = buildKitgun(chamber("catchmoon_chamber"), grip("grip_brash"), loader("loader_zip"));
    const out = keepLegalModularBuild({
      ...base,
      weapon,
      modularType: "kitgun",
      mods: [
        { modId: "hornet_strike_r3", slotIndex: 0 },
        { modId: "kitgun_riven_mod", slotIndex: 1 },
        { modId: "hush_r3", slotIndex: 8 },
      ],
      rivenStats: { 1: { damage: 100 } },
      slotPolarities: { 0: "madurai", 8: "naramon" },
      arcanes: [arc("arcane_secondary_merciless"), arc("pax_bolt")],
      arcaneRanks: [5, 5],
    });
    expect(out.mods.map((m) => m.modId)).toEqual(["kitgun_riven_mod"]);
    expect(out.rivenStats).toEqual({ 1: { damage: 100 } });
    expect(out.arcanes.map((a) => a?.id ?? null)).toEqual([null, "pax_bolt"]);
    expect(out.slotPolarities).toEqual({ 0: "madurai" });
    expect(out.dropped).toContain("Hornet Strike");
    expect(out.dropped).toContain("Secondary Merciless");
  });

  it("drops only the Riven when the chamber changes", () => {
    const weapon = buildKitgun(chamber("gaze_chamber"), grip("grip_gibber"), loader("loader_zip"));
    const out = keepLegalModularBuild({
      ...base,
      weapon,
      modularType: "kitgun",
      mods: [{ modId: "hornet_strike_r3", slotIndex: 0 }, { modId: "kitgun_riven_mod", slotIndex: 1 }],
      rivenStats: { 1: { damage: 100 } },
      arcanes: [null, null],
      arcaneRanks: [5, 5],
      rivenWeaponChanged: true,
    });
    expect(out.mods.map((m) => m.modId)).toEqual(["hornet_strike_r3"]);
    expect(out.rivenStats).toEqual({});
    expect(out.dropped).toEqual(["Riven"]);
  });

  it("keeps zaw mods and arcanes across grip / link edits", () => {
    const weapon = buildZaw(zawStrikes[0], zawGrips[1], zawLinks[1]);
    const melee = allMods.find((m) => m.name === "Pressure Point")!;
    const out = keepLegalModularBuild({
      ...base,
      weapon,
      modularType: "zaw",
      mods: [{ modId: melee.id, slotIndex: 0 }],
      arcanes: [null, null],
      arcaneRanks: [5, 5],
    });
    expect(out.dropped).toEqual([]);
    expect(out.mods).toHaveLength(1);
  });

  it("keeps amp arcanes when the prism changes", () => {
    const ampArc = allArcanes.find((a) => a.subCategory === "amp")!;
    const p = ampPrisms[1];
    const out = keepLegalModularBuild({
      ...base,
      weapon: { ...p, arcaneSlots: 2, arcaneType: "amp" },
      modularType: "amp",
      mods: [],
      arcanes: [ampArc, null],
      arcaneRanks: [2, 5],
    });
    expect(out.dropped).toEqual([]);
    expect(out.arcanes[0]?.id).toBe(ampArc.id);
    expect(out.arcaneRanks[0]).toBe(2);
  });
});

describe("modular builder page wiring", () => {
  it("part buttons no longer call resetMods", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("src/app/modular-builder/page.tsx", "utf8");
    expect(src).not.toMatch(/set(KitgunChamber|KitgunGrip|KitgunLoader|ZawStrike|ZawGripSel|ZawLinkSel|AmpPrism)\([a-z]\); resetMods\(\)/);
    expect(src).toMatch(/editPart\(\{ prism: p \}\)/);
  });
});
