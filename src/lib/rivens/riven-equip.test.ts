import { describe, expect, it } from "vitest";
import { parseRivenEquip, placeRiven, rivenEquipQuery, stripRivenEquipParams } from "./riven-equip";

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
});
