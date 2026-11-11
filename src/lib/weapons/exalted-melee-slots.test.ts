/**
 * Stance capacity (wiki.warframe.com/w/Stance: 5 maxed, 10 on a matching slot) and Exalted melee
 * stances (wiki.warframe.com/w/Exalted_Weapon Update 38.5: Zenurik stance + slot, "+10 capacity boost";
 * Garuda Talons: Madurai slot, any Claw stance).
 */
import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { STANCE_WEAPON_TYPE } from "@/data/stances";
import {
  EXALTED_STANCE_CAPACITY,
  exaltedMaxCapacity,
  isStanceAllowed,
  stanceCapacityBonus,
  stanceSlotInfo,
  weaponStanceCapacity,
} from "@/lib/weapons/exalted-melee-slots";

const w = (id: string) => allWeapons.find((x) => x.id === id)!;
const typeOf = (id: string) => STANCE_WEAPON_TYPE[id];

describe("stance capacity", () => {
  const dervish = modsMap.get("stance_crimson_dervish")!; // Madurai, drain -2, max rank 3
  it("is 5 maxed, 10 matched, 4 mismatched", () => {
    expect(stanceCapacityBonus(dervish, undefined)).toBe(5);
    expect(stanceCapacityBonus(dervish, "madurai")).toBe(10);
    expect(stanceCapacityBonus(dervish, "naramon")).toBe(4);
    expect(stanceCapacityBonus(null, "madurai")).toBe(0);
  });
});

describe("Exalted melee stance slots", () => {
  const locked = [
    "exalted_blade", "exalted_blade_prime", "exalted_blade_umbra", "iron_staff", "iron_staff_prime",
    "talons", "talons_prime", "desert_wind", "desert_wind_prime", "shadow_claws", "shadow_claws_prime",
    "diwata", "diwata_prime", "landslide_fists", "shattered_lash", "whipclaw", "shadow_clones",
  ];
  it("every exalted melee except Garuda Talons has a locked Zenurik stance worth +10", () => {
    for (const id of locked) {
      const slot = stanceSlotInfo(w(id));
      expect(slot?.kind, id).toBe("fixed");
      expect(exaltedMaxCapacity(w(id), modsMap.get("stance_crimson_dervish"))).toBe(60 + EXALTED_STANCE_CAPACITY);
    }
    expect(stanceSlotInfo(w("talons"))).toMatchObject({ stanceName: "Hysteria", polarity: "zenurik" });
  });

  it("covers every exalted melee in the catalog", () => {
    const melee = allWeapons.filter((x) => x.isExalted && x.category === "melee");
    for (const x of melee) expect(stanceSlotInfo(x), x.id).not.toBeNull();
  });

  it("Garuda Talons take a chosen Claw stance on a Madurai slot", () => {
    const talons = w("garuda_talons");
    const slot = stanceSlotInfo(talons);
    expect(slot).toEqual({ kind: "choice", polarity: "madurai", stanceType: "claw" });
    const claw = modsMap.get("four_riders")!; // Claw, Madurai
    expect(isStanceAllowed(talons, claw, typeOf)).toBe(true);
    expect(isStanceAllowed(talons, modsMap.get("stance_crimson_dervish"), typeOf)).toBe(false);
    expect(exaltedMaxCapacity(talons, claw)).toBe(70);
    expect(exaltedMaxCapacity(talons, null)).toBe(60);
  });

  it("non-melee exalted and arch-melee have no stance", () => {
    for (const id of ["regulators", "artemis_bow", "dex_pixia", "arquebex", "ironbride"]) {
      expect(stanceSlotInfo(w(id)), id).toBeNull();
      expect(exaltedMaxCapacity(w(id))).toBe(60);
    }
  });

  it("normal melee add their chosen stance on the innate stance polarity", () => {
    const skana = w("skana");
    const slot = stanceSlotInfo(skana);
    expect(slot?.kind).toBe("choice");
    const dervish = modsMap.get("stance_crimson_dervish")!;
    expect(weaponStanceCapacity(skana, dervish)).toBe(stanceCapacityBonus(dervish, slot?.kind === "choice" ? slot.polarity : undefined));
  });
});

describe("saved exalted stance", () => {
  it("survives loadout normalization", async () => {
    const { normalizeWarframeBuild } = await import("@/lib/builds/loadout-slot-helpers");
    const out = normalizeWarframeBuild({
      warframeId: "garuda",
      mods: [],
      arcaneIds: [null, null],
      hasOrokinReactor: true,
      isMR30: false,
      slotPolarities: {},
      exaltedStanceModId: "four_riders",
    });
    expect(out.exaltedStanceModId).toBe("four_riders");
  });
});
