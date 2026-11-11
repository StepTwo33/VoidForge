import { describe, expect, it } from "vitest";
import type { Loadout, ModularBuildData } from "@/lib/types";
import {
  applyModularSlotMove,
  isLoadoutWeaponSlot,
  planModularSlotMove,
  slotForModularBuild,
  getSlotOccupant,
} from "@/lib/builds/modular-slot-move";
import { getLoadoutModular, getWeaponSlotPayload } from "@/lib/builds/loadout-slot-helpers";

const kitgun = (grip: "grip_tremor" | "grip_haymaker"): ModularBuildData => ({
  modularType: "kitgun",
  parts: { chamber: "catchmoon_chamber", grip, loader: "loader_splat" },
  mods: [{ modId: "hornet_strike", rank: 10, slotIndex: 0 }],
  hasOrokinCatalyst: true,
});

const zaw = (): ModularBuildData => ({
  modularType: "zaw",
  parts: { strike: "zaw_balla", grip: "zaw_grip_peye", link: "zaw_link_jai" },
  mods: [],
  hasOrokinCatalyst: false,
});

const loadout = (extra: Partial<Loadout> = {}): Loadout => ({
  id: "l1",
  name: "Terkeon",
  createdAt: 1,
  updatedAt: 1,
  modularBuilds: { primary: kitgun("grip_tremor") },
  ...extra,
});

describe("slotForModularBuild", () => {
  it("puts a primary-grip kitgun in primary and a secondary-grip kitgun in secondary", () => {
    expect(slotForModularBuild(kitgun("grip_tremor"))).toBe("primary");
    expect(slotForModularBuild(kitgun("grip_haymaker"))).toBe("secondary");
  });
  it("puts a Zaw in melee and an Amp in no weapon slot", () => {
    expect(slotForModularBuild(zaw())).toBe("melee");
    expect(slotForModularBuild({ modularType: "amp", parts: { prism: "amp_raplak" }, mods: [], hasOrokinCatalyst: false })).toBeNull();
  });
  it("isLoadoutWeaponSlot accepts only the three weapon columns", () => {
    expect(isLoadoutWeaponSlot("secondary")).toBe(true);
    expect(isLoadoutWeaponSlot("operator")).toBe(false);
  });
});

describe("planModularSlotMove / applyModularSlotMove", () => {
  it("returns null when the item already belongs in its slot", () => {
    expect(planModularSlotMove(loadout(), "primary", kitgun("grip_tremor"))).toBeNull();
  });

  it("moves a kitgun to the empty matching slot and empties the original", () => {
    const plan = planModularSlotMove(loadout(), "primary", kitgun("grip_haymaker"), {
      loadoutName: "Terkeon",
      reason: "Changing to a secondary grip",
    })!;
    expect(plan.action).toBe("move");
    expect(plan.from).toBe("primary");
    expect(plan.to).toBe("secondary");
    expect(plan.destructive).toBe(false);
    expect(plan.title).toBe("Move to the Secondary slot?");
    expect(plan.description).toContain("Changing to a secondary grip will move this Kitgun to the Secondary slot of “Terkeon”");
    expect(plan.description).toContain("The Primary slot will be emptied");

    const next = applyModularSlotMove(loadout(), plan, kitgun("grip_haymaker"));
    expect(getLoadoutModular(next, "secondary")?.parts.grip).toBe("grip_haymaker");
    expect(getLoadoutModular(next, "secondary")?.mods).toHaveLength(1);
    expect(getWeaponSlotPayload(next, "primary")).toBeNull();
  });

  it("replaces a normal secondary (Lex Prime can't go in the Primary slot)", () => {
    const lo = loadout({
      secondaryBuild: { weaponId: "lex_prime", mods: [{ modId: "hornet_strike", rank: 10, slotIndex: 0 }], arcaneIds: [null, null], hasOrokinCatalyst: true, slotPolarities: {} },
    });
    const plan = planModularSlotMove(lo, "primary", kitgun("grip_haymaker"), { loadoutName: "Terkeon" })!;
    expect(plan.action).toBe("replace");
    expect(plan.displaced?.name).toBe("Lex Prime");
    expect(plan.destructive).toBe(true);
    expect(plan.description).toContain("already has Lex Prime");
    expect(plan.description).toContain("can't go in the Primary slot");

    const next = applyModularSlotMove(lo, plan, kitgun("grip_haymaker"));
    expect(getLoadoutModular(next, "secondary")?.parts.grip).toBe("grip_haymaker");
    expect(getLoadoutModular(next, "secondary")?.mods).toHaveLength(1);
    expect(next.secondaryBuild).toBeUndefined();
    expect(getWeaponSlotPayload(next, "primary")).toBeNull();
  });

  it("swaps with an occupant that can legally go in the vacated slot", () => {
    // A primary-grip kitgun sitting in the Secondary slot (already mismatched) can return to Primary.
    const misplaced: ModularBuildData = {
      modularType: "kitgun",
      parts: { chamber: "tombfinger_chamber", grip: "grip_tremor", loader: "loader_slap" },
      mods: [{ modId: "serration", rank: 10, slotIndex: 0 }],
      hasOrokinCatalyst: false,
    };
    const lo = loadout({ modularBuilds: { primary: kitgun("grip_tremor"), secondary: misplaced } });
    const plan = planModularSlotMove(lo, "primary", kitgun("grip_haymaker"))!;
    expect(plan.action).toBe("swap");
    expect(plan.displaced?.name).toBeTruthy();
    expect(plan.destructive).toBe(false);
    expect(plan.description).toMatch(/will move to the Primary slot/);

    const next = applyModularSlotMove(lo, plan, kitgun("grip_haymaker"));
    expect(getLoadoutModular(next, "secondary")?.parts.grip).toBe("grip_haymaker");
    expect(getLoadoutModular(next, "primary")?.parts.chamber).toBe("tombfinger_chamber");
    expect(getLoadoutModular(next, "primary")?.mods).toHaveLength(1);
  });

  it("swaps a regular primary weapon that was sitting in the Secondary slot back to Primary", () => {
    const lo = loadout({
      modularBuilds: { primary: kitgun("grip_tremor") },
      secondaryBuild: { weaponId: "braton_prime", mods: [{ modId: "serration", rank: 10, slotIndex: 0 }], arcaneIds: [null, null], hasOrokinCatalyst: true, slotPolarities: {} },
    });
    const plan = planModularSlotMove(lo, "primary", kitgun("grip_haymaker"))!;
    expect(plan.action).toBe("swap");
    expect(plan.displaced?.name).toBe("Braton Prime");
    const next = applyModularSlotMove(lo, plan, kitgun("grip_haymaker"));
    expect(getLoadoutModular(next, "secondary")?.parts.grip).toBe("grip_haymaker");
    expect(next.primaryBuild?.weaponId).toBe("braton_prime");
    expect(next.primaryBuild?.mods).toHaveLength(1);
    expect(getLoadoutModular(next, "primary")).toBeNull();
  });

  it("replaces an occupant that cannot go in the vacated slot (e.g. a melee weapon in secondary)", () => {
    const lo = loadout({
      secondaryBuild: { weaponId: "skiajati", mods: [], arcaneIds: [null, null], hasOrokinCatalyst: false, slotPolarities: {} },
    });
    // Skiajati is a melee nikana — it cannot move to primary.
    const plan = planModularSlotMove(lo, "primary", kitgun("grip_haymaker"), { loadoutName: "Terkeon" })!;
    expect(plan.action).toBe("replace");
    expect(plan.destructive).toBe(true);
    expect(plan.description).toMatch(/can't go in the Primary slot/);
    expect(plan.description).toMatch(/will be removed from the loadout/);

    const next = applyModularSlotMove(lo, plan, kitgun("grip_haymaker"));
    expect(getLoadoutModular(next, "secondary")?.parts.grip).toBe("grip_haymaker");
    expect(next.secondaryBuild).toBeUndefined();
    expect(getWeaponSlotPayload(next, "primary")).toBeNull();
    expect(next.meleeBuild).toBeUndefined();
  });

  it("moves a Zaw out of a primary slot into melee", () => {
    const lo = loadout();
    const plan = planModularSlotMove(lo, "primary", zaw())!;
    expect(plan.action).toBe("move");
    expect(plan.to).toBe("melee");
    expect(plan.itemLabel).toBe("Zaw");
    const next = applyModularSlotMove(lo, plan, zaw());
    expect(getLoadoutModular(next, "melee")?.modularType).toBe("zaw");
    expect(getWeaponSlotPayload(next, "primary")).toBeNull();
  });

  it("the reverse: a secondary kitgun switched to a primary grip moves back", () => {
    const lo = loadout({ modularBuilds: { secondary: kitgun("grip_haymaker") } });
    const plan = planModularSlotMove(lo, "secondary", kitgun("grip_tremor"), {
      reason: "Changing to a primary grip",
    })!;
    expect(plan.action).toBe("move");
    expect(plan.to).toBe("primary");
    expect(plan.description).toContain("Changing to a primary grip will move this Kitgun to the Primary slot");
    const next = applyModularSlotMove(lo, plan, kitgun("grip_tremor"));
    expect(getLoadoutModular(next, "primary")?.parts.grip).toBe("grip_tremor");
    expect(getWeaponSlotPayload(next, "secondary")).toBeNull();
  });

  it("getSlotOccupant names a modular kit and a regular weapon", () => {
    const lo = loadout({
      secondaryBuild: { weaponId: "lex_prime", mods: [], hasOrokinCatalyst: false },
    });
    expect(getSlotOccupant(lo, "primary")?.kind).toBe("modular");
    expect(getSlotOccupant(lo, "secondary")?.name).toBe("Lex Prime");
    expect(getSlotOccupant(lo, "melee")).toBeNull();
  });
});
