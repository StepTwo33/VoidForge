import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { allWarframes } from "@/data/warframes";
import { allMods } from "@/data/mods";
import { getExaltedWeaponsForWarframe } from "@/lib/weapons/exalted-weapons";
import { exaltedMaxCapacity, stanceSlotInfo, weaponHasExilusSlot } from "@/lib/weapons/exalted-melee-slots";
import { weaponModCapacity } from "@/lib/weapons/weapon-progenitor";
import { archgunModsForBuilder } from "@/lib/mods/archgun-weapon-augment-mods";
import { filterArchmeleeMods } from "@/lib/mods/archmelee-mods";

/**
 * Necramech exalted weapons in the vehicle builder.
 *
 * wiki.warframe.com/w/Arquebex — Voidrig's Guard Mode exalted Archgun; uses Arch-gun
 * mods; lacks Arcane Enhancement slots; innate Catalyst (exalted, 60 capacity).
 * wiki.warframe.com/w/Ironbride — Bonewidow's Exalted Ironbride (Archmelee).
 * wiki.warframe.com/w/Voidrig — Gravemines is ability 3 (throws mines), not a
 * second moddable exalted weapon. Arch-melee has no stance slot (stanceSlotInfo).
 */
describe("Necramech exalted weapons (Voidrig Arquebex, Bonewidow Ironbride)", () => {
  const arquebex = allWeapons.find((w) => w.id === "arquebex")!;
  const ironbride = allWeapons.find((w) => w.id === "ironbride")!;

  it("maps Voidrig only to Arquebex (Guard Mode) and Bonewidow only to Ironbride", () => {
    const voidrig = getExaltedWeaponsForWarframe("voidrig", allWeapons);
    expect(voidrig.map((w) => w.id)).toEqual(["arquebex"]);
    expect(voidrig[0]!.abilityName).toMatch(/Guard Mode/i);
    expect(voidrig[0]!.category).toBe("archgun");
    expect(voidrig[0]!.isExalted).toBe(true);

    const bonewidow = getExaltedWeaponsForWarframe("bonewidow", allWeapons);
    expect(bonewidow.map((w) => w.id)).toEqual(["ironbride"]);
    expect(bonewidow[0]!.category).toBe("archmelee");
    expect(bonewidow[0]!.isExalted).toBe(true);
  });

  it("does not treat Gravemines as a moddable exalted weapon (it is Voidrig ability 3)", () => {
    const voidrig = allWarframes.find((w) => w.id === "voidrig");
    const names = (voidrig?.abilities ?? []).map((a) => a.name);
    expect(names).toContain("Gravemines");
    expect(allWeapons.some((w) => /gravemine/i.test(w.id) || /gravemine/i.test(w.name))).toBe(false);
    expect(getExaltedWeaponsForWarframe("voidrig", allWeapons).every((w) => !/gravemine/i.test(w.name))).toBe(true);
  });

  it("has an innate catalyst (60 capacity) like other exalted weapons", () => {
    expect(weaponModCapacity(arquebex, 0, false)).toBe(60);
    expect(weaponModCapacity(ironbride, 0, false)).toBe(60);
    // Arch-melee has no stance, so exalted max is the innate 60 (not 60+10).
    expect(exaltedMaxCapacity(arquebex)).toBe(60);
    expect(exaltedMaxCapacity(ironbride)).toBe(60);
    expect(stanceSlotInfo(arquebex)).toBeNull();
    expect(stanceSlotInfo(ironbride)).toBeNull();
  });

  it("gives Arquebex the Arch-gun mod pool and no Arcane slots", () => {
    const pool = archgunModsForBuilder("arquebex");
    expect(pool.length).toBeGreaterThan(10);
    expect(pool.every((m) => m.category === "archgun" || m.subCategory === "weapon")).toBe(true);
    expect(pool.some((m) => m.category === "rifle" || m.category === "shotgun" || m.category === "melee")).toBe(false);
    expect(pool.some((m) => m.category === "necramech")).toBe(false);
    // wiki.warframe.com/w/Arquebex Notes: "Despite being an Archgun, Arquebex lacks Arcane Enhancement slots."
    expect(arquebex.arcaneSlots ?? 0).toBe(0);
    expect(arquebex.modSlots).toBe(8);
    expect(arquebex.hasRivenSlot).toBe(false);
  });

  it("gives Ironbride the Arch-melee mod pool, not ground melee mods", () => {
    const pool = filterArchmeleeMods(allMods);
    expect(pool.length).toBeGreaterThan(5);
    expect(pool.some((m) => m.id === "tempered_blade" || m.id === "furor" || m.id === "cutting_edge")).toBe(true);
    expect(pool.some((m) => m.id === "pressure_point" || m.id === "true_steel" || m.id === "organ_shatter")).toBe(false);
    expect(pool.some((m) => m.category === "melee" && m.category !== "archmelee")).toBe(false);
    expect(ironbride.modSlots).toBe(8);
  });

  it("keeps Exilus available (same helper as warframe exalted, not a pseudo-exalted)", () => {
    expect(weaponHasExilusSlot(arquebex)).toBe(true);
    expect(weaponHasExilusSlot(ironbride)).toBe(true);
  });
});
