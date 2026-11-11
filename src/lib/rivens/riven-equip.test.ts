import { describe, expect, it } from "vitest";
import {
  appendReturnSearch,
  builderReturnSearch,
  draftMatchesRivenWeapon,
  matchingDraftKind,
  parseRivenEquip,
  placeLibraryRivenOnMods,
  placeRiven,
  rivenCannotEquipReason,
  rivenEquipHref,
  rivenEquipQuery,
  stripRivenEquipParams,
  type BuilderDraft,
} from "./riven-equip";

const isRiven = (id: string) => id.startsWith("riven_");
const mod = (modId: string, slotIndex: number) => ({ modId, modName: modId, rank: 5, slotIndex });

describe("riven equip link", () => {
  it("round-trips polarity, rank, name and id", () => {
    const q = rivenEquipQuery({ stats: { critChance: 1.2, multishot: 0.9 }, polarity: "naramon", rank: 5, name: "Soma Critatis", id: "abc" });
    expect(parseRivenEquip(new URLSearchParams(q))).toEqual({
      stats: { critChance: 1.2, multishot: 0.9 }, polarity: "naramon", rank: 5, name: "Soma Critatis", id: "abc",
    });
  });
  it("reads old stats-only links at rank 8 with no polarity chosen", () => {
    const p = new URLSearchParams({ riven: JSON.stringify({ critChance: 1 }) });
    expect(parseRivenEquip(p)).toMatchObject({ rank: 8, polarity: "universal" });
  });
  it("rejects bad JSON and clamps rank", () => {
    expect(parseRivenEquip(new URLSearchParams({ riven: "{nope" }))).toBeNull();
    expect(parseRivenEquip(new URLSearchParams({ riven: '{"critChance":1}', rivenRank: "40" }))?.rank).toBe(8);
  });
  it("strips only the equip params", () => {
    expect(stripRivenEquipParams("/weapon-builder?weapon=soma&riven=%7B%7D&rivenRank=5#x")).toBe("/weapon-builder?weapon=soma#x");
  });
  it("routes companion, kitgun and zaw rivens to their builders when no draft is open", () => {
    const stats = { critChance: 1 };
    expect(rivenEquipHref({ weaponId: "deconstructor", weaponType: "Companion", stats, polarity: "madurai", rank: 8 }, { drafts: {} })).toContain("/companion-builder?weapon=deconstructor&");
    expect(rivenEquipHref({ weaponId: "kitgun_tombfinger", weaponType: "Kitgun", stats, polarity: "madurai", rank: 8 }, { drafts: {} })).toContain("/modular-builder?type=kitgun&part=kitgun_tombfinger&");
    expect(rivenEquipHref({ weaponId: "zaw_kronsh", weaponType: "Zaw", stats, polarity: "madurai", rank: 8 }, { drafts: {} })).toContain("/modular-builder?type=zaw&part=zaw_kronsh&");
    expect(rivenEquipHref({ weaponId: "soma", weaponType: "Rifle", stats, polarity: "madurai", rank: 8 }, { drafts: {} })).toContain("/weapon-builder?weapon=soma&");
  });
  it("returns to the open companion or modular build when the draft matches the riven", () => {
    const stats = { critChance: 1 };
    const companion: BuilderDraft<unknown> = {
      itemId: "deconstructor",
      buildId: "c1",
      name: "Helios Build",
      description: "",
      isPublic: false,
      tags: [],
      createdAt: 1,
      data: { companionId: "helios" },
    };
    expect(rivenEquipHref(
      { weaponId: "deconstructor", weaponType: "Companion", stats, polarity: "madurai", rank: 8 },
      { drafts: { companion } },
    )).toContain("/companion-builder?weapon=deconstructor&");
    const modular: BuilderDraft<unknown> = {
      itemId: "kitgun_tombfinger",
      buildId: null,
      name: "Tombfinger Build",
      description: "",
      isPublic: false,
      tags: [],
      createdAt: 1,
      data: { modularType: "kitgun" },
      returnSearch: "loadout=L1&slot=secondary",
    };
    const href = rivenEquipHref(
      { weaponId: "kitgun_tombfinger", weaponType: "Kitgun", stats, polarity: "madurai", rank: 5, name: "Tombfinger Riven" },
      { drafts: { modular } },
    );
    expect(href).toContain("/modular-builder?type=kitgun&part=kitgun_tombfinger&");
    expect(href).toContain("loadout=L1");
    expect(href).toContain("slot=secondary");
  });
  it("does not merge a riven into a different weapon's open build", () => {
    const somaDraft: BuilderDraft<unknown> = {
      itemId: "soma", buildId: null, name: "Soma", description: "", isPublic: false, tags: [], createdAt: 1, data: {},
    };
    const href = rivenEquipHref(
      { weaponId: "braton", weaponType: "Rifle", stats: { damage: 1 }, polarity: "madurai", rank: 8 },
      { drafts: { weapon: somaDraft } },
    );
    expect(href).toContain("/weapon-builder?weapon=braton&");
    expect(matchingDraftKind("braton", { weapon: somaDraft })).toBeNull();
  });
});

describe("rivenCannotEquipReason", () => {
  it("allows weapons that take rivens", () => {
    expect(rivenCannotEquipReason({ id: "soma", name: "Soma", category: "rifle" })).toBeNull();
    expect(rivenCannotEquipReason({ id: "imperator", name: "Imperator", category: "archgun" })).toBeNull();
    expect(rivenCannotEquipReason({ id: "deconstructor", name: "Deconstructor", category: "sentinel_weapon" })).toBeNull();
  });
  it("blocks exalted weapons, Garuda's Talons, amps, arch-melee and beast claws", () => {
    expect(rivenCannotEquipReason({ id: "exalted_blade", name: "Exalted Blade", category: "melee", hasRivenSlot: false })).toBe(
      "Exalted Blade cannot use Rivens.",
    );
    expect(rivenCannotEquipReason({ id: "garuda_talons", name: "Garuda's Talons", category: "melee", hasRivenSlot: false })).toBe(
      "Garuda's Talons cannot use Rivens.",
    );
    expect(rivenCannotEquipReason({ id: "amp_raplak", name: "Raplak Prism", category: "amp_prism" })).toBe(
      "Raplak Prism cannot use Rivens.",
    );
    expect(rivenCannotEquipReason({ id: "onorix", name: "Onorix", category: "archmelee" })).toBe(
      "Onorix cannot use Rivens.",
    );
    expect(rivenCannotEquipReason({ id: "kubrow_claws", name: "Kubrow Claws", category: "beast_claw" })).toBe(
      "Kubrow Claws cannot use Rivens.",
    );
  });
  it("is silent when the catalog weapon is unknown (the builder decides)", () => {
    expect(rivenCannotEquipReason(null, "Mystery")).toBeNull();
  });
});

describe("draft matching and return search", () => {
  it("treats riven family variants as the same weapon", () => {
    expect(draftMatchesRivenWeapon("soma_prime", "soma") || draftMatchesRivenWeapon("soma", "soma_prime")).toBe(true);
    expect(draftMatchesRivenWeapon("braton", "soma")).toBe(false);
  });
  it("keeps only loadout and slot params", () => {
    expect(builderReturnSearch("?loadout=abc&slot=primary&weapon=soma&foo=1")).toBe("loadout=abc&slot=primary");
    expect(builderReturnSearch("weapon=soma")).toBeUndefined();
    expect(appendReturnSearch("/weapon-builder?weapon=soma&riven=%7B%7D", "loadout=L&slot=melee")).toBe(
      "/weapon-builder?weapon=soma&riven=%7B%7D&loadout=L&slot=melee",
    );
  });
});

describe("placeRiven", () => {
  const riven = { stats: { critChance: 1 }, polarity: "madurai", rank: 5, name: "R", modId: "riven_rifle", fallbackName: "Soma Riven", catalogDrain: 10 };
  it("adds to the first free slot and keeps the build", () => {
    const out = placeRiven([mod("serration", 0), mod("split_chamber", 1)], {}, riven, { regularSlots: 8, isRivenModId: isRiven });
    expect(out.slotIndex).toBe(2);
    expect(out.mods.map((m) => m.modId)).toEqual(["serration", "split_chamber", "riven_rifle"]);
    expect(out.mods[2]).toMatchObject({ rank: 5, polarity: "madurai", modName: "R" });
    expect(out.rivenStats).toEqual({ 2: { critChance: 1 } });
  });
  it("replaces an equipped riven in its slot", () => {
    const out = placeRiven([mod("serration", 0), mod("riven_rifle", 4)], { 4: { damage: 1 } }, riven, { regularSlots: 8, isRivenModId: isRiven });
    expect(out.slotIndex).toBe(4);
    expect(out.mods.filter((m) => isRiven(m.modId))).toHaveLength(1);
    expect(out.rivenStats).toEqual({ 4: { critChance: 1 } });
  });
  it("uses the last regular slot when full and reports what it replaced", () => {
    const full = Array.from({ length: 8 }, (_, i) => mod(`m${i}`, i));
    const out = placeRiven(full, {}, riven, { regularSlots: 8, isRivenModId: isRiven });
    expect(out.slotIndex).toBe(7);
    expect(out.replaced?.modId).toBe("m7");
    expect(out.mods).toHaveLength(8);
  });
  it("writes riven fields onto saved mod slots and keeps the rest of the build", () => {
    const out = placeLibraryRivenOnMods(
      [
        { modId: "serration", rank: 10, slotIndex: 0 },
        { modId: "split_chamber", rank: 5, slotIndex: 1 },
      ],
      riven,
    );
    expect(out.slotIndex).toBe(2);
    expect(out.mods).toEqual([
      { modId: "serration", rank: 10, slotIndex: 0 },
      { modId: "split_chamber", rank: 5, slotIndex: 1 },
      { modId: "riven_rifle", rank: 5, slotIndex: 2, rivenStats: { critChance: 1 }, rivenPolarity: "madurai", rivenDrain: 15, rivenName: "R" },
    ]);
  });
});

describe("archgun Equip routing", () => {
  it("sends an archgun riven to the weapon builder when no archwing draft is open", () => {
    const href = rivenEquipHref(
      { weaponId: "imperator", weaponType: "Archgun", stats: { damage: 1 }, polarity: "madurai", rank: 8 },
      { drafts: {} },
    );
    expect(href).toContain("/weapon-builder?weapon=imperator&");
    expect(href).not.toContain("/archwing-builder");
  });
  it("returns an archgun riven to the open archwing build when that draft matches", () => {
    const archwing: BuilderDraft<unknown> = {
      itemId: "imperator",
      buildId: "a1",
      name: "Odonata Build",
      description: "",
      isPublic: false,
      tags: [],
      createdAt: 1,
      data: { mode: "archwing", weaponId: "imperator" },
    };
    const href = rivenEquipHref(
      { weaponId: "imperator", weaponType: "Archgun", stats: { damage: 1 }, polarity: "madurai", rank: 8, name: "Imperator Riven" },
      { drafts: { archwing, weapon: { ...archwing, name: "Imperator WB" } } },
    );
    expect(href).toContain("/archwing-builder?weapon=imperator&");
    expect(href).not.toContain("/weapon-builder");
    expect(matchingDraftKind("imperator", { archwing })).toBe("archwing");
  });
  it("does not send an Imperator riven to an archwing draft that has a different archgun", () => {
    const archwing: BuilderDraft<unknown> = {
      itemId: "corvas", buildId: null, name: "Corvas", description: "", isPublic: false, tags: [], createdAt: 1, data: {},
    };
    const href = rivenEquipHref(
      { weaponId: "imperator", weaponType: "Archgun", stats: { damage: 1 }, polarity: "madurai", rank: 8 },
      { drafts: { archwing } },
    );
    expect(href).toContain("/weapon-builder?weapon=imperator&");
    expect(matchingDraftKind("imperator", { archwing })).toBeNull();
  });
});
